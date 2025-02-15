import { GraphQLScalarType } from 'graphql';
import { AuthorModel, FolderModel, NoteModel } from "../models/index.js";

export const resolvers = {
    Date: new GraphQLScalarType({
        name: 'Date',
        parseValue(value) {
          return new Date(value);
        },
        serialize(value) {
          return value.toISOString();
        },
      }),
    Query: {
        folders : async (parent, args, context) => { 
             //return fakeData.folders
            const folders = await FolderModel.find({
                authorId: context.uid,
            }).sort({
                updatedAt: 'desc'
            });
            console.log({folders, context});
            
            return folders;
        },
        folder: async (parent, args) => {
            const folderId = args.folderId;
            console.log({folderId});
            //return fakeData.folders.find(folder => folder.id === folderId);
            const foundFolder = await FolderModel.findById(folderId);
            return foundFolder;
        },
        note: async (parent, args) => {
            const noteId = args.noteId;
            const note = await NoteModel.findById(noteId);
            return note;
            //return fakeData.notes.find(note => note.id === noteId);
        }
    },
    Folder: {
        author : async (parent, args) => { 
            console.log({parent, args});
            const authorId = parent.authorId;
            const author = await AuthorModel.findOne({
                uid: authorId
            })
            return author;
            //return fakeData.authors.find(author => author.id === authorId);
            //return {id : '123', name : 'HoleTex'}
        },
        notes: async (parent, args) => {
            console.log({parent})
            const notes = await NoteModel.find({
                folderId: parent.id
            }).sort({
                updatedAt: 'desc',
            });
            console.log({notes})
            return notes;
            //return fakeData.notes.filter(note => note.folderId === parent.id);
        }
    },
    Mutation: {
        addNote: async (parent, args) => {
            const newNote = new NoteModel(args);
            await newNote.save();
            return newNote;
        },
        updateNote: async (parent, args) => {
            const noteId = args.id;
            const note = await NoteModel.findByIdAndUpdate(noteId, args);
            return note;
        },
        addFolder: async (parent, args, context) => {
            const newFolder = new FolderModel({...args, authorId: context.uid});
            console.log({newFolder});
            await newFolder.save();
            return newFolder;
        },
        register: async (parent, args) => {
            const foundUser = await AuthorModel.findOne({uid: args.uid});
            if(!foundUser) {
                const newUser = new AuthorModel(args);
                await newUser.save();
                return newUser;
            }
            return foundUser;
        }
    }

};