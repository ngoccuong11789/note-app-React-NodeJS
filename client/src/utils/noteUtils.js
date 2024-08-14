import { graphqlRequest } from "./request";

export const notesLoader = async ({ params: { folderId } }) => {
    console.log('loader', { folderId });
    const query = `query Folders($folderId: String!) {
                                            folder(folderId: $folderId) {
                                            id
                                            name
                                            notes {
                                                    id
                                                    content
                                                    updatedAt
                                            }
                                        }
                                        }
                                        `;
    const data = await graphqlRequest({query,
            variables: {
            folderId
        }
    })
    return data;

    // const res = await fetch('http://localhost:4000/graphql', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         query,
    //         variables: {
    //             folderId: folderId
    //         }

    //     })
    // });

    // const { data } = await res.json();
    // console.log('[Note List]', { data });
    // return data;

}

export const noteLoader = async ({ params: { noteId } }) => {
    console.log('loader', { noteId });
    const query = `query Note($noteId: String) {
  note(noteId: $noteId) {
    content
    id
  }
}

                                        `;

    // const res = await fetch('http://localhost:4000/graphql', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         query,
    //         variables: {
    //             noteId
    //         }

    //     })
    // });

    // const { data } = await res.json();
    // console.log('[Note List]', { data });
    // return data;
    const data = await graphqlRequest({query,
        variables: {
            noteId,
        },
    })
    return data;

};

export const addNewNote = async ({ params, request }) => {
    const newNote = await request.formData();
    const formDataObj = {};
    newNote.forEach((value, key) => (formDataObj[key] = value));
    console.log({newNote, formDataObj});
    //return null;
    const query = `mutation Mutation($content: String!, $folderId: ID!) {
        addNote(content: $content, folderId: $folderId) {
          id
          content
        }
      }`;
    
      const {addNote} = await graphqlRequest({
        query,
        variables: formDataObj
      })
    
      console.log({addNote})
    
      return addNote;

}

export const updateNote = async ({ params, request}) => {
    const updatedNote = await request.formData();
    const formDataObj = {};
    updatedNote.forEach((value, key) => (formDataObj[key] = value));
    
    console.log({updatedNote, formDataObj});
    const query = `mutation Mutation($id: String!, $content: String!) {
      updateNote(id: $id, content: $content) {
        id
        content
      }
    }`;
  
    const {updateNote} = await graphqlRequest({
      query,
      variables: formDataObj
    })
  
    console.log({updateNote})
  
    return updateNote;
  }