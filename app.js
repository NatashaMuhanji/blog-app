import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

//fileURLToPath() method is used to convert a file URL to a file path.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an Express application
const app = express();
const port = 3000;

//template engine, Parse URL-encoded bodies, serve static files
app.set ('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let posts = [];

// routes
app.get('/', (req, res) => {
    res.render('index', { posts});
});

app.get('/posts/new', (req, res) => {
    res.render('new');
});

app.post('/posts', (req, res) => {
    const {title, content} = req.body;
    posts.push({id: posts.length + 1, title, content});
    res.redirect('/');
});

app.get('/posts/:id/edit', (req, res) => {
    const post = posts.find(post => post.id === Number(req.params.id));
    res.render('edit', {post});
});

app.post('/posts/:id', (req, res) => {
    const {title, content} = req.body;
    const post = posts.find(post => post.id === Number(req.params.id));
    if (post) {
        post.title = title;
        post.content = content;
        res.redirect('/');
    } else {
        res.status(404).send('Post not found');
    }
});

app.post('/posts/:id/delete', (req, res) => {
    posts = posts.filter(post => post.id !== Number(req.params.id));
    res.redirect('/');
});

//for 404 error handling
app.get('/posts/:id/edit', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) {
      return res.status(404).send('Post not found');
    }
    res.render('edit', { post });
  });
  
  app.post('/posts/:id', (req, res) => {
    const { title, content } = req.body;
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) {
      return res.status(404).send('Post not found');
    }
    post.title = title;
    post.content = content;
    res.redirect('/');
  });
  
  app.post('/posts/:id/delete', (req, res) => {
    const initialLength = posts.length;
    posts = posts.filter(p => p.id !== parseInt(req.params.id));
    if (posts.length === initialLength) {
      return res.status(404).send('Post not found');
    }
    res.redirect('/');
  });

  //for basic form validation
  app.post('/posts', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).send('Title and content are required');
    }
    posts.push({ title, content, id: posts.length + 1 });   
    res.redirect('/');
  });

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});