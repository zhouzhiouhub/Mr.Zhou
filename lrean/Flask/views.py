from flask import render_template, request, redirect, url_for, flash, session
from app import app, db
from models import User, Post
from functools import wraps

# 登录验证装饰器
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('请先登录', 'danger')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# 首页
@app.route('/')
def index():
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return render_template('index.html', posts=posts)

# 注册
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        
        # 检查用户名或邮箱是否已存在
        user_exists = User.query.filter((User.username == username) | (User.email == email)).first()
        if user_exists:
            flash('用户名或邮箱已存在', 'danger')
            return redirect(url_for('register'))
        
        # 创建新用户
        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        
        flash('注册成功，请登录', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')

# 登录
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            session['user_id'] = user.id
            session['username'] = user.username
            flash('登录成功', 'success')
            return redirect(url_for('index'))
        
        flash('用户名或密码错误', 'danger')
    
    return render_template('login.html')

# 登出
@app.route('/logout')
def logout():
    session.clear()
    flash('已登出', 'success')
    return redirect(url_for('index'))

# 查看单篇文章
@app.route('/post/<int:post_id>')
def view_post(post_id):
    post = Post.query.get_or_404(post_id)
    return render_template('post.html', post=post)

# 创建新文章
@app.route('/post/new', methods=['GET', 'POST'])
@login_required
def new_post():
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        
        post = Post(title=title, content=content, user_id=session['user_id'])
        db.session.add(post)
        db.session.commit()
        
        flash('文章发布成功', 'success')
        return redirect(url_for('index'))
    
    return render_template('create_post.html')

# 编辑文章
@app.route('/post/<int:post_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_post(post_id):
    post = Post.query.get_or_404(post_id)
    
    # 确保只有作者能编辑
    if post.user_id != session['user_id']:
        flash('您没有权限编辑此文章', 'danger')
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        post.title = request.form['title']
        post.content = request.form['content']
        db.session.commit()
        
        flash('文章更新成功', 'success')
        return redirect(url_for('view_post', post_id=post.id))
    
    return render_template('edit_post.html', post=post)

# 删除文章
@app.route('/post/<int:post_id>/delete', methods=['POST'])
@login_required
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    
    # 确保只有作者能删除
    if post.user_id != session['user_id']:
        flash('您没有权限删除此文章', 'danger')
        return redirect(url_for('index'))
    
    db.session.delete(post)
    db.session.commit()
    
    flash('文章已删除', 'success')
    return redirect(url_for('index'))