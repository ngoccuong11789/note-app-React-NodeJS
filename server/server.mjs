import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer'
import bodyParser from 'body-parser';
import {expressMiddleware} from '@apollo/server/express4'
import cors from 'cors'
import fakeData from './fakeData/index.js';
import mongoose from 'mongoose';
import 'dotenv/config';
import { resolvers } from './resolvers/index.js';
import { typeDefs } from './schemas/index.js';
import './firebaseConfig.js'
import { getAuth } from 'firebase-admin/auth'

const app = express();
const httpServer = http.createServer(app);

// const typeDefs = `#graphql

//     type Folder {
//         id : String,
//         name : String,
//         createdAt : String,
//         author: Author
//         notes : [Note]
//     }

//     type Note {
//         id: String, 
//         content: String,
//     }

//     type Author {
//         id : String,
//         name : String
//     }

//     type Query {
//         folders: [Folder],
//         folder(folderId: String): Folder,
//         note(noteId: String): Note
//     }
// `;
// const resolvers = {
//     Query: {
//         folders : () => { return fakeData.folders},
//         folder: (parent, args) => {
//             const folderId = args.folderId;
//             console.log({folderId});
//             return fakeData.folders.find(folder => folder.id === folderId);
//         },
//         note: (parent, args) => {
//             const noteId = args.noteId;
//             return fakeData.notes.find(note => note.id === noteId);
//         }
//     },
//     Folder: {
//         author : (parent, args) => { 
//             console.log({parent, args});
//             const authorId = parent.authorId;
//             return fakeData.authors.find(author => author.id === authorId);
//             //return {id : '123', name : 'HoleTex'}
//         },
//         notes: (parent, args) => {
//             console.log({parent})
//             return fakeData.notes.filter(note => note.folderId === parent.id);
//         }

//     }
// };

//Connect to DB
const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.js2lh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const PORT = process.env.PORT || 4000;

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})]
})

await server.start();

// const authorizationJWT = async (req, res, next) => {
//     console.log({authorization: req.headers.authorization});
//     next();
// }

const authorizationJWT = async (req, res, next) => {
    console.log({ authorization: req.headers.authorization });
    const authorizationHeader = req.headers.authorization;
  
    if (authorizationHeader) {
      const accessToken = authorizationHeader.split(' ')[1];
  
      getAuth()
        .verifyIdToken(accessToken)
        .then((decodedToken) => {
          console.log({ decodedToken });
          res.locals.uid = decodedToken.uid;
          next();
        })
        .catch((err) => {
          console.log({ err });
          return res.status(403).json({ message: 'Forbidden', error: err });
        });
    } else {
      //next();
       return res.status(401).json({ message: 'Unauthorized' });
    }
  };

// app.use(cors(), authorizationJWT,  bodyParser.json(), expressMiddleware(server));
app.use(cors(), authorizationJWT,  bodyParser.json(), expressMiddleware(server, {
    context: async ({req, res}) => {
        return {uid: res.locals.uid}
    }
}));

mongoose.set('strictQuery', false);
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then (async () => {
    console.log('Connected to DB123');
    await new Promise((resolve) => httpServer.listen({port: PORT}, resolve));
    console.log('Server ready at http://localhost:4000');
})

