        // 全局变量
        let loggedInUser = null;

        // 切换登录/注册表单
        function toggleForm() {
            const loginForm = document.getElementById('loginForm');
            const signupForm = document.getElementById('signupForm');

            loginForm.classList.toggle('active');
            signupForm.classList.toggle('active');

            // 清空错误和成功提示
            clearMessages();
        }

        // 清空所有提示信息
        function clearMessages() {
            const messages = document.querySelectorAll('.error-message, .success-message');
            messages.forEach(msg => msg.classList.remove('show'));
        }

        // 显示错误信息
        function showError(message, type = 'login') {
            const errorEl = document.getElementById(`${type}Error`);
            errorEl.textContent = message;
            errorEl.classList.add('show');
            setTimeout(() => {
                errorEl.classList.remove('show');
            }, 4000);
        }

        // 显示成功信息
        function showSuccess(message, type = 'login') {
            const successEl = document.getElementById(`${type}Success`);
            successEl.textContent = message;
            successEl.classList.add('show');
            setTimeout(() => {
                successEl.classList.remove('show');
            }, 2000);
        }

        // 设置按钮加载状态
        function setButtonLoading(button, loading) {
            if (loading) {
                button.disabled = true;
                button.classList.add('loading');
                button.innerHTML = '<span class="spinner"></span>';
            } else {
                button.disabled = false;
                button.classList.remove('loading');
                button.innerHTML = button.classList.contains('signup-button') ? 'Create Account' : 'Sign In';
            }
        }

        // 登录处理
        function handleLogin() {
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            // 验证
            if (!username) {
                showError('Please enter your username');
                return;
            }
            if (!password) {
                showError('Please enter your password');
                return;
            }

            const button = event.target;
            setButtonLoading(button, true);

            axios.post('https://robbie-3fob.onrender.com/robert/login', {
                userName: username,
                password: password
            }).then(res => {
                setButtonLoading(button, false);
                
                if (res.data && res.data.token) {
                    loggedInUser = res.data;
                    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
                    showSuccess('Sign in successful! Redirecting...');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    showError('Invalid username or password');
                }
            }).catch(err => {
                setButtonLoading(button, false);
                showError(err.response?.data?.message || 'Sign in failed. Please try again');
            });
        }

        // 注册处理
        function handleSignup() {
            const username = document.getElementById('signupUsername').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value.trim();
            const confirmPassword = document.getElementById('signupConfirmPassword').value.trim();
            const sex = document.querySelector('input[name="sex"]:checked')?.value;

            // 验证
            if (!username) {
                showError('Please enter a username', 'signup');
                return;
            }
            if (!email) {
                showError('Please enter your email', 'signup');
                return;
            }
            if (!email.includes('@')) {
                showError('Please enter a valid email', 'signup');
                return;
            }
            if (!password) {
                showError('Please create a password', 'signup');
                return;
            }
            if (password.length < 6) {
                showError('Password must be at least 6 characters', 'signup');
                return;
            }
            if (password !== confirmPassword) {
                showError('Passwords do not match', 'signup');
                return;
            }
            if (!sex) {
                showError('Please select a gender', 'signup');
                return;
            }

            const button = event.target;
            setButtonLoading(button, true);

            axios.post('https://robbie-3fob.onrender.com/robert/register', {
                username: username,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
                sex: sex
            }).then(res => {
                setButtonLoading(button, false);
                
                if (res.data === '注册成功' || res.data === 'Success') {
                    showSuccess('Account created successfully! Signing in...', 'signup');
                    setTimeout(() => {
                        // 清空表单
                        document.getElementById('signupUsername').value = '';
                        document.getElementById('signupEmail').value = '';
                        document.getElementById('signupPassword').value = '';
                        document.getElementById('signupConfirmPassword').value = '';
                        document.querySelectorAll('input[name="sex"]').forEach(r => r.checked = false);
                        
                        // 切换到登录表单并自动填充
                        toggleForm();
                        document.getElementById('loginUsername').value = username;
                        document.getElementById('loginPassword').value = password;
                    }, 2000);
                } else {
                    showError(res.data || 'Sign up failed', 'signup');
                }
            }).catch(err => {
                setButtonLoading(button, false);
                showError(err.response?.data || 'Sign up failed. Please try again', 'signup');
            });
        }

        // GitHub 登录
        function githubLogin() {
            window.location.href = 'https://robbie-3fob.onrender.com/robert/oauth/github/login';
        }

        // 检查 GitHub 登录回调
        (function () {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');
            const username = params.get('username');
            const userId = params.get('userId');
            
            if (token) {
                const user = {
                    userId: parseInt(userId),
                    token: token,
                    userName: username
                };
                loggedInUser = user;
                localStorage.setItem('loggedInUser', JSON.stringify(user));

                // 清除 URL 参数
                window.history.replaceState({}, document.title, window.location.pathname);

                console.log('GitHub sign in successful', user);
                
                // 显示成功并重定向
                showSuccess('GitHub sign in successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }
        })();

        // 回车键提交
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const loginForm = document.getElementById('loginForm');
                if (loginForm.classList.contains('active')) {
                    handleLogin();
                } else {
                    handleSignup();
                }
            }
        });