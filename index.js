const e = require('express');
const express=require('express');

const app=express();

app.use(express.json());



let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

  const requestLogger=(request,response,next)=>
  {
    console.log("Logging",request.path);
    console.log("Logging",request.method);
    next();
  }

  app.use(requestLogger);


  app.get('/',(request,response)=>response.send('<h1>Hello World </h1>'));

  app.get('/api/notes',(request,response)=>response.json(notes));

  app.get('/api/notes/:id',(request,response)=>
  {
    const id=Number(request.params.id);
    const note=notes.find(note=>note.id===id);
    if(!note)
    {
        response.status(404).send(`No note found with id ${id}`);
    }
    else
    {
    response.json(note);
    }

  })

  app.delete('/api/notes/:id',(request,response)=>
  {
    const id=Number(request.params.id);
    const noteToDelete=notes.find(note=>note.id===id);
    if(!noteToDelete)
    {
        response.status(404).send(`No note found with id ${id}`);
    }
    else
    {
    notes=notes.filter(note=>note.id!==id);
    response.status(204).end();
    }

  })

  const generateMaxId=()=>
  {
    const maxId=Math.max(...notes.map(note=>note.id));
    return maxId;
  }

  app.post('/api/notes',(request,response)=>
  {
    const body=request.body;
    console.log(body);
    if(!body.content)
    {
        return response.status(400).send({
            error:"Content is missing"
        })
    }
    
    const newNote=
    {
        id:generateMaxId()+1,
        content:body.content,
        important:body.important || false
    };
    notes=notes.concat(newNote);

    console.log(notes);

    response.status(201).send(`note with id ${newNote.id} is successfully created`);
    
  })

  const port=process.env.PORT || 3001;

  app.listen(port,()=>console.log(`server is running at ${port}`));