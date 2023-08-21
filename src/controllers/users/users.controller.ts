// import * as bcrypt from 'bcrypt';
// import * as dotenv from 'dotenv';
// import User from '../../models/User';
// import { FilterQuery } from 'mongoose';
// import AppError from '../../lib/app-error';
// import { cloudinaryAPI } from '../../config/cloudnary';
// import { Request as IReq, Response as IRes } from 'express';
// import Denounce from '../../models/Denounces';
// import StoryController from './stories';

// dotenv.config(); // imports env variables

// export default class UserController {
//   async getUser(req: IReq, res: IRes): Promise<void> {
//     const { id } = req.params;
//     const defaultFields = '-password -invalidated -user_type -last_session';
//     const foundUser = await User.findOne({ _id: id })
//       .select(defaultFields)
//       .lean();
//     if (!foundUser) throw new AppError('Erro: usuário não encontrado.', 404);
//     res.status(200).json(foundUser);
//   }

//   async getPublicUser(req: IReq, res: IRes): Promise<void> {
//     const { id } = req.params;
//     const defaultFields =
//       '-password -invalidated -user_type -last_session -main_phone_number -alternative_phone_number -birth_date -gender -__v';
//     const foundUser = await User.findOne({ _id: id, invalidated: false })
//       .select(defaultFields)
//       .lean();
//     if (!foundUser) throw new AppError('Erro: usuário não encontrado.', 404);
//     res.status(200).json(foundUser);
//   }

//   async getAllUsers(req: IReq, res: IRes): Promise<void> {
//     const { search, offset, limit, sort, fields, user_type, invalidated } =
//       req.query;

//     const queryParams: FilterQuery<IUser> = {};

//     if (search) {
//       const searchString = String(search);
//       queryParams['$or'] = [
//         { first_name: { $regex: searchString, $options: 'i' } },
//         { last_name: { $regex: searchString, $options: 'i' } },
//       ];
//     }

//     if (user_type) {
//       queryParams.user_type = String(user_type);
//     }

//     if (invalidated) {
//       queryParams.invalidated = Boolean(Number(invalidated));
//     }

//     let queryResult = User.find(queryParams);

//     if (fields) {
//       const formatedFields = String(fields).split(',').join(' ');
//       queryResult = queryResult.select(formatedFields);
//     }
//     if (sort) {
//       queryResult = queryResult.sort(String(sort));
//     } else {
//       queryResult = queryResult.sort('updatedAt');
//     }
//     if (offset && limit) {
//       queryResult = queryResult.skip(Number(offset)).limit(Number(limit));
//     }

//     const foundDocs = await queryResult.lean();
//     res.status(200).json(foundDocs);
//   }

//   async getPublicUsers(req: IReq, res: IRes): Promise<void> {
//     const { search, offset, limit, sort } = req.query;

//     const queryParams: FilterQuery<IUser> = {};

//     if (search) {
//       const searchString = String(search);
//       queryParams['$or'] = [
//         { first_name: { $regex: searchString, $options: 'i' } },
//         { last_name: { $regex: searchString, $options: 'i' } },
//       ];
//     }

//     let queryResult = User.find(queryParams).select(
//       'first_name last_name email'
//     );

//     if (sort) {
//       queryResult = queryResult.sort(String(sort));
//     } else {
//       queryResult = queryResult.sort({ updatedAt: 'asc', first_name: 'asc' });
//     }
//     if (offset && limit) {
//       queryResult = queryResult.skip(Number(offset)).limit(Number(limit));
//     }

//     const foundDocs = await queryResult.lean();
//     res.status(200).json(foundDocs);
//   }

//   async createUser(req: IReq, res: IRes): Promise<void> {
//     const { password, ussid, email, ...data } = req.body;

//     if (ussid || data.user_type === 'super-user') {
//       if (process.env.USSID !== ussid)
//         throw new AppError('Erro: sem permissão para criar usuário.', 401);
//     }

//     if (!password || String(password).length < 8)
//       throw new AppError('A senha deve ter pelo menos 8 caracteres', 400);
//     if (!email) throw new AppError('Coloque o seu e-mail', 400);

//     // check for duplicates
//     const existingUser = await User.exists({ email }).lean();
//     if (existingUser)
//       throw new AppError('Conta criada com o seu e-mail já existe.', 409);

//     const createdUser = await User.create({ ...data, password, email });
//     // creates a new generic store for the user
//     const createdStore = await Store.create({
//       name: '[NOME DA SUA NOVA LOJA]',
//       description: '[A DESCRIÇÃO DE SUA NOVA LOJA]',
//       created_by: createdUser._id,
//     });
//     // saves the store id to user doc
//     await User.updateOne({ _id: createdUser._id }, { store: createdStore._id });

//     res.sendStatus(201);
//   }

//   async updateUser(req: IReq, res: IRes): Promise<void> {
//     let { supressed_user, user, invalidated, ...userData } = req.body;
//     const defaultFields = '-password -invalidated -user_type -last_session';

//     if (user.user_type === 'super-user' && supressed_user) {
//       user.id = supressed_user;
//     }

//     if (invalidated && user.user_type !== 'super-user')
//       throw new AppError('Sem permissão para fazer atualizações.', 403);

//     if (!userData) throw new AppError('Erro: sem dados para atualizar.', 400);

//     const foundUser = await User.findOne({ _id: user.id }).lean();
//     if (!foundUser) throw new AppError('Erro: usuário não encontrado.', 404);

//     const { profileImageData, coverImageData, password, ...data } = userData;

//     if (password) {
//       if (String(password).length < 8)
//         throw new AppError('A senha deve ter pelo menos 8 caracteres.', 400);
//       const salt = await bcrypt.genSalt(10);
//       data.password = await bcrypt.hash(password, salt);
//     }
//     if (process.env.NODE_ENV === 'development') {
//       if (profileImageData?.data) {
//         data.profile_image = {
//           id: profileImageData.id || 'development',
//           url: profileImageData.data,
//         };
//       }
//       if (coverImageData?.data) {
//         data.cover_image = {
//           id: coverImageData.id || 'development',
//           url: coverImageData.data,
//         };
//       }
//     } else {
//       if (profileImageData?.data) {
//         let result = await cloudinaryAPI.uploader.upload(
//           profileImageData.data,
//           {
//             public_id: profileImageData.id || undefined,
//             folder: '/sales-api/users/account',
//           }
//         );
//         data.profile_image = {
//           id: result.public_id,
//           url: result.secure_url,
//         };
//       }
//       if (coverImageData?.data) {
//         let result = await cloudinaryAPI.uploader.upload(coverImageData.data, {
//           public_id: coverImageData.id || undefined,
//           folder: '/sales-api/users/account',
//         });
//         data.cover_image = {
//           id: result.public_id,
//           url: result.secure_url,
//         };
//       }
//     }

//     if (invalidated !== undefined) {
//       data.invalidated = invalidated;
//     }

//     const updatedDoc = await User.findOneAndUpdate(
//       { _id: user.id },
//       { ...data },
//       { runValidators: true, new: true }
//     )
//       .select(defaultFields)
//       .lean();
//     if (!updatedDoc) throw new AppError('Erro: falha ao atualizar dados', 403);
//     res.status(200).json({ ...updatedDoc });
//   }

//   async deleteUser(req: IReq, res: IRes): Promise<void> {
//     let { user, supressed_user } = req.body;

//     if (user.user_type === 'super-user' && supressed_user) {
//       user.id = supressed_user;
//     }
//     await Denounce.deleteMany({ denounced_by: user.id });
//     await Comment.deleteMany({ created_by: user.id }).lean();
//     await StoryController.deleteAllStories(user.id);
//     await StoreController.deleteStore(user.id);
//     const deletedDoc = await User.findOneAndDelete({
//       _id: user.id,
//     }).lean();
//     if (!deletedDoc)
//       throw new AppError(
//         'Erro ao eliminar conta de usuário. Por favor, tente novamente.',
//         400
//       );

//     if (process.env.NODE_ENV !== 'development') {
//       await cloudinaryAPI.uploader.destroy(deletedDoc.cover_image.id, {
//         invalidate: true,
//       });
//       await cloudinaryAPI.uploader.destroy(deletedDoc.profile_image.id, {
//         invalidate: true,
//       });
//     }
//     res.sendStatus(204);
//   }

//   async deleteUserAsset(req: IReq, res: IRes): Promise<void> {
//     const { user, ...data } = req.body;
//     if (!data.type || !data.assetId)
//       throw new AppError('Coloque o ID da imagem.', 400);

//     const serializeImageData = function () {
//       switch (data.type) {
//         case 'cover_image':
//           return { cover_image: { id: '', url: '' } };
//         case 'profile_image':
//           return { profile_image: { id: '', url: '' } };
//         default:
//           return undefined;
//       }
//     };

//     const updatedDoc = await User.findOneAndUpdate(
//       { _id: user.id },
//       serializeImageData(),
//       { runValidators: true, new: true }
//     ).lean();
//     if (!updatedDoc) throw new AppError('Erro: falha ao atualizar dados', 403);

//     if (process.env.NODE_ENV !== 'development') {
//       await cloudinaryAPI.uploader.destroy(data.assetId, {
//         invalidate: true,
//       });
//     }
//     res.sendStatus(204);
//   }
// }
