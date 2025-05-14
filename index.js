let posts = [];

async function getPosts() {
    const response = await fetch('https:jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    data.forEach(post => {
        posts.push(post);
    });
    console.log(posts);
}

let editingPostId = null;

async function createOrUpdatePost(e) {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const form = document.getElementById('new-post');
    const button = document.getElementById('button');
    const buttonHide = document.querySelector('.hide-new-post');

    if (!title || !content) return;

    if (editingPostId === null) {
        const newPost = {
            userId: 15,
            id: posts.length + 1,
            title: title,
            body: content
        };
        posts.push(newPost);
        console.log("criado:", newPost);
    } else {
        const post = posts.find(p => p.id === editingPostId);
        if (post) {
            post.title = title;
            post.body = content;
            console.log("editando:", post);
        }
        editingPostId = null;
        button.textContent = 'Postar';
    }

    renderPosts();
    form.reset();
    form.style.display = 'none';  
    buttonHide.style.bottom = '1rem';
    buttonHide.style.bottom = '1rem';  
    buttonHide.style.left = '1rem';
    buttonHide.textContent = '+'
    document.querySelector('.hide-new-post span').textContent = '+';
}


async function deletePost(id) {
    const postIndex = posts.findIndex(post => post.id === id);
    if (postIndex !== -1) {
        console.log("deletou");
        posts.splice(postIndex, 1);
    }
}

function editPost(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    const form = document.getElementById('new-post');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const button = document.getElementById('button');
    const buttonHide = document.querySelector('.hide-new-post');

    editingPostId = id;

    titleInput.value = post.title;
    contentInput.value = post.body;
    buttonHide.style.bottom = '19rem';
    buttonHide.style.left = '19rem';
    buttonHide.textContent = '+';

    form.style.display = 'flex';
    button.textContent = 'Salvar';
    document.querySelector('.hide-new-post span').textContent = 'X';
    renderPosts();
}


async function renderPosts() {
    const postsContainer = document.querySelector('.posts');
    postsContainer.innerHTML = '';
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <div class="post-content">
                <h2>${post.title}</h2>
                <p>${post.body}</p>
            </div>
            <div class="post-footer">
                <div class="delete" data-id="${post.id}">Deletar</div>
                <div class="edit" data-id="${post.id}">Editar</div>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });

    const deleteButtons = document.querySelectorAll('.delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = parseInt(e.target.dataset.id);
            await deletePost(id);
            renderPosts();
        });
    });

    const editButtons = document.querySelectorAll('.edit');
    editButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            editPost(id);
        });
    });
}

async function init() {
    await getPosts(); 
    renderPosts();
}

init();

async function showForm() {
    const form = document.getElementById('new-post');
    const buttonHide = document.querySelector('.hide-new-post');
    const button = document.getElementById('button');
    button.textContent = 'Postar';
    form.reset()

    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'flex';  
        buttonHide.style.bottom = '19rem';  
        buttonHide.style.left = '19rem';
        buttonHide.textContent = 'X'
    } else {
        form.style.display = 'none';  
        buttonHide.style.bottom = '1rem';
        buttonHide.style.bottom = '1rem';  
        buttonHide.style.left = '1rem';
        buttonHide.textContent = '+'
    }
}

document.getElementById('new-post').addEventListener('submit', createOrUpdatePost);
