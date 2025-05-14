let posts = [];

async function getPosts() {
    const response = await fetch('https:jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    data.forEach(post => {
        posts.push(post);
    });
    console.log(posts);
}

async function createNewPost(title, content) {
    const newPost = {
        userID: 15,
        id: posts.length + 1,
        title: title,
        body: content
    };
    console.log("criou");
    posts.push(newPost);    
}

document.getElementById('new-post').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    console.log(title, content);
    await createNewPost(title, content);
    renderPosts();
    e.target.reset();
});

async function deletePost(id) {
    const postIndex = posts.findIndex(post => post.id === id);
    if (postIndex !== -1) {
        console.log("deletou");
        posts.splice(postIndex, 1);
    }
}

async function editPost(id) {
    // console.log(id);
    const form = document.getElementById('new-post');
    form.reset()
    const post = posts.find(post => post.id === id);
    if (post) {
        const titleInput = document.getElementById('title');
        const contentInput = document.getElementById('content');
        const button = document.getElementById('button');

        titleInput.value = post.title;
        contentInput.value = post.body;

        form.style.display = 'flex';
        button.textContent = 'Salvar';
        document.querySelector('.hide-new-post span').textContent = 'X';

        button.onclick = async (e) => {
            e.preventDefault();
            post.title = titleInput.value;
            post.body = contentInput.value;

            button.textContent = 'Postar';
            button.onclick = null; 
            form.style.display = 'none';
            document.querySelector('.hide-new-post span').textContent = '+';

            renderPosts();
        };
    }
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