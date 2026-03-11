// State Management
const state = {
    currentUser: null,
    currentView: 'login',
    recipes: [],
    currentRecipe: null,
    searchQuery: '',
    speech: {
        synthesis: window.speechSynthesis,
        utterance: null,
        isPaused: false,
        currentStep: 0
    }
};

// Initialize App
function init() {
    loadInitialData();
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        state.currentUser = savedUser;
        state.currentView = 'recipeList';
    }
    render();
}

// Load Initial Data
function loadInitialData() {
    // מחיקת נתונים ישנים אם יש פחות מ-11 מתכונים
    const existingRecipes = localStorage.getItem('recipes');
    if (existingRecipes) {
        const recipes = JSON.parse(existingRecipes);
        if (recipes.length < 11) {
            localStorage.removeItem('recipes');
        }
    }
    
    if (!localStorage.getItem('users')) {
        const defaultUsers = {
            'admin': {
                password: '1234',
                settings: {
                    theme: 'light',
                    readingDelay: 2,
                    fontSize: 'medium',
                    speechRate: 1,
                    speechPitch: 1
                }
            },
            'user': {
                password: 'pass',
                settings: {
                    theme: 'light',
                    readingDelay: 2,
                    fontSize: 'medium',
                    speechRate: 1,
                    speechPitch: 1
                }
            }
        };
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    if (!localStorage.getItem('recipes')) {
        const defaultRecipes = [
            {
                id: 1,
                name: 'עוגת שוקולד קלאסית',
                ingredients: ['2 כוסות קמח', '1.5 כוס סוכר', '3 ביצים', '100 גרם חמאה', '200 גרם שוקולד מריר', 'חצי כוס חלב', '1 כפית אבקת אפייה', 'קורט מלח'],
                instructions: ['מחממים תנור ל-180 מעלות', 'ממיסים שוקולד וחמאה במיקרוגל', 'מערבבים ביצים וסוכר עד לקבלת תערובת אוורירית', 'מוסיפים את תערובת השוקולד', 'מנפים קמח ואבקת אפייה ומוסיפים לתערובת', 'מוסיפים חלב ומערבבים', 'יוצקים לתבנית משומנת', 'אופים 35-40 דקות', 'מצננים ומגישים']
            },
            {
                id: 2,
                name: 'עוגיות שוקולד צ\'יפס',
                ingredients: ['2 כוסות קמח', '1 כוס חמאה רכה', '1 כוס סוכר חום', 'חצי כוס סוכר לבן', '2 ביצים', '2 כפיות תמצית וניל', '1 כפית סודה לשתייה', 'קורט מלח', '2 כוסות שוקולד צ\'יפס'],
                instructions: ['מחממים תנור ל-180 מעלות', 'מקציפים חמאה וסוכר', 'מוסיפים ביצים ווניל', 'מערבבים קמח סודה ומלח', 'מוסיפים לתערובת הרטובה', 'מוסיפים שוקולד צ\'יפס', 'יוצרים כדורים ומניחים על תבנית', 'אופים 10-12 דקות', 'מצננים על רשת']
            },
            {
                id: 3,
                name: 'עוגת גבינה אפויה',
                ingredients: ['500 גרם גבינת שמנת', '1 כוס סוכר', '4 ביצים', '2 כפות קמח', '1 כפית תמצית וניל', 'חצי כוס שמנת מתוקה', '200 גרם עוגיות פירורים לבסיס', '100 גרם חמאה מומסת'],
                instructions: ['מחממים תנור ל-160 מעלות', 'מערבבים פירורי עוגיות עם חמאה ומרפדים תבנית', 'מקציפים גבינה וסוכר', 'מוסיפים ביצים אחת אחת', 'מוסיפים קמח וניל ושמנת', 'יוצקים על הבסיס', 'אופים 50-60 דקות', 'מצננים בהדרגה', 'מקררים 4 שעות לפחות']
            },
            {
                id: 4,
                name: 'עוגיות חמאה דניות',
                ingredients: ['2 כוסות קמח', '200 גרם חמאה קרה', 'חצי כוס סוכר', '1 ביצה', '1 כפית תמצית וניל', 'קורט מלח', 'סוכר לפיזור'],
                instructions: ['מערבבים קמח סוכר ומלח', 'מוסיפים חמאה קרה ופורסים לפירורים', 'מוסיפים ביצה ווניל', 'לשים בקלילות עד קבלת בצק', 'מצננים בצק 30 דקות', 'מרדדים ויוצרים צורות', 'מפזרים סוכר', 'אופים ב-180 מעלות 12-15 דקות']
            },
            {
                id: 5,
                name: 'בראוניז שוקולד עשיר',
                ingredients: ['200 גרם שוקולד מריר', '150 גרם חמאה', '1 כוס סוכר', '3 ביצים', 'חצי כוס קמח', '3 כפות קקאו', 'קורט מלח', 'חצי כוס אגוזי מלך קצוצים'],
                instructions: ['מחממים תנור ל-180 מעלות', 'ממיסים שוקולד וחמאה', 'מוסיפים סוכר ומערבבים', 'מוסיפים ביצים אחת אחת', 'מנפים קמח וקקאו ומוסיפים', 'מוסיפים אגוזים', 'יוצקים לתבנית מרובעת', 'אופים 25-30 דקות', 'מצננים וחותכים לריבועים']
            },
            {
                id: 6,
                name: 'עוגת תפוחים וקינמון',
                ingredients: ['3 תפוחים גדולים', '2 כוסות קמח', '1 כוס סוכר', '3 ביצים', 'חצי כוס שמן', '1 כפית קינמון', '1 כפית אבקת אפייה', 'קורט מלח', 'סוכר וקינמון לפיזור'],
                instructions: ['מחממים תנור ל-180 מעלות', 'קולפים ופורסים תפוחים', 'מערבבים ביצים סוכר ושמן', 'מוסיפים קמח אבקת אפייה קינמון ומלח', 'מערבבים עד לקבלת בצק חלק', 'מוסיפים חצי מהתפוחים לבצק', 'יוצקים לתבנית', 'מסדרים תפוחים מעל', 'מפזרים סוכר וקינמון', 'אופים 45-50 דקות']
            },
            {
                id: 7,
                name: 'עוגיות שקדים רכות',
                ingredients: ['2 כוסות קמח שקדים', '1 כוס סוכר', '3 חלבוני ביצים', '1 כפית תמצית שקדים', 'קורט מלח', 'שקדים שלמים לקישוט', 'סוכר אבקה'],
                instructions: ['מחממים תנור ל-170 מעלות', 'מקציפים חלבונים עם סוכר', 'מוסיפים קמח שקדים ותמצית', 'מערבבים בעדינות', 'יוצרים כדורים קטנים', 'מניחים על תבנית עם נייר אפייה', 'לוחצים שקד בכל עוגייה', 'אופים 15-18 דקות', 'מפזרים סוכר אבקה']
            },
            {
                id: 8,
                name: 'עוגת שיש קלאסית',
                ingredients: ['2 כוסות קמח', '1.5 כוס סוכר', '4 ביצים', '1 כוס שמן', 'חצי כוס מיץ תפוזים', '1 כפית אבקת אפייה', '3 כפות קקאו', '2 כפות חלב'],
                instructions: ['מחממים תנור ל-180 מעלות', 'מערבבים ביצים וסוכר', 'מוסיפים שמן ומיץ תפוזים', 'מוסיפים קמח ואבקת אפייה', 'מחלקים בצק לשני חלקים', 'מערבבים קקאו וחלב בחלק אחד', 'יוצקים לתבנית בשכבות מתחלפות', 'מערבבים בעדינות עם מזלג ליצירת שיש', 'אופים 45-50 דקות']
            },
            {
                id: 9,
                name: 'מאפינס שוקולד',
                ingredients: ['2 כוסות קמח', '1 כוס סוכר', '2 ביצים', 'חצי כוס שמן', '1 כוס חלב', '3 כפות קקאו', '1 כפית אבקת אפייה', 'קורט מלח', 'חצי כוס שוקולד צ\'יפס'],
                instructions: ['מחממים תנור ל-180 מעלות', 'מערבבים מרכיבים יבשים בקערה', 'מערבבים מרכיבים רטובים בקערה נפרדת', 'מוסיפים רטוב ליבש ומערבבים בקלילות', 'מוסיפים שוקולד צ\'יפס', 'ממלאים תבניות מאפינס', 'אופים 20-25 דקות', 'מצננים ומגישים']
            },
            {
                id: 10,
                name: 'עוגת גזר אמריקאית',
                ingredients: ['2 כוסות קמח', '2 כוסות גזר מגורד', '1.5 כוס סוכר', '4 ביצים', '1 כוס שמן', '2 כפיות קינמון', '1 כפית אבקת אפייה', 'חצי כפית סודה לשתייה', 'קורט מלח', 'חצי כוס אגוזים קצוצים'],
                instructions: ['מחממים תנור ל-180 מעלות', 'מערבבים ביצים סוכר ושמן', 'מוסיפים גזר מגורד', 'מנפים קמח אבכת אפייה סודה קינמון ומלח', 'מוסיפים לתערובת הרטובה', 'מוסיפים אגוזים', 'יוצקים לתבנית משומנת', 'אופים 50-60 דקות', 'מצננים ומגישים']
            },
            {
                id: 11,
                name: 'עוגיות אוראו ביתיות',
                ingredients: ['2 כוסות קמח', 'חצי כוס קקאו', '1 כוס חמאה רכה', '1 כוס סוכר', '1 ביצה', '1 כפית וניל', 'קורט מלח', '200 גרם גבינת שמנת למילוי', 'חצי כוס חמאה למילוי', '2 כוסות סוכר אבקה למילוי'],
                instructions: ['מערבבים חמאה וסוכר', 'מוסיפים ביצה ווניל', 'מוסיפים קמח קקאו ומלח', 'מצננים בצק 30 דקות', 'מרדדים ויוצרים עיגולים', 'אופים ב-180 מעלות 10 דקות', 'מכינים מילוי: מקציפים חמאה גבינה וסוכר אבכה', 'מצננים עוגיות לגמרי', 'ממרחים מילוי על עוגייה אחת', 'מכסים בעוגייה שנייה']
            }
        ];
        localStorage.setItem('recipes', JSON.stringify(defaultRecipes));
    }

    state.recipes = JSON.parse(localStorage.getItem('recipes'));
}

// Save Data
function saveRecipes() {
    localStorage.setItem('recipes', JSON.stringify(state.recipes));
}

function saveUserSettings(username, settings) {
    const users = JSON.parse(localStorage.getItem('users'));
    users[username].settings = settings;
    localStorage.setItem('users', JSON.stringify(users));
}

function getUserSettings(username) {
    const users = JSON.parse(localStorage.getItem('users'));
    return users[username]?.settings || {
        theme: 'light',
        readingDelay: 2,
        fontSize: 'medium',
        speechRate: 1,
        speechPitch: 1
    };
}

// Render Functions
function render() {
    const app = document.getElementById('app');
    
    switch (state.currentView) {
        case 'login':
            app.innerHTML = renderLogin();
            attachLoginEvents();
            break;
        case 'recipeList':
            app.innerHTML = renderRecipeList();
            attachRecipeListEvents();
            applyUserSettings();
            break;
        case 'recipeView':
            app.innerHTML = renderRecipeView();
            attachRecipeViewEvents();
            applyUserSettings();
            break;
        case 'settings':
            app.innerHTML = renderSettings();
            attachSettingsEvents();
            applyUserSettings();
            break;
    }
}

function renderLogin() {
    return `
        <div class="login-container">
            <div class="login-box">
                <h1>🍳 ספר המתכונים שלי</h1>
                <p style="text-align: center; margin-bottom: 20px; color: var(--text-secondary);">הזן שם משתמש וסיסמה כדי להתחיל</p>
                <form id="loginForm">
                    <div class="form-group">
                        <label for="username">שם משתמש</label>
                        <input type="text" id="username" required minlength="3">
                    </div>
                    <div class="form-group">
                        <label for="password">סיסמה</label>
                        <input type="password" id="password" required minlength="4">
                    </div>
                    <button type="submit" class="btn">כניסה / הרשמה</button>
                    <div id="loginError" class="error-message"></div>
                </form>
            </div>
        </div>
    `;
}

function renderRecipeList() {
    const filteredRecipes = state.recipes.filter(recipe =>
        recipe.name.includes(state.searchQuery)
    );

    return `
        <div class="header">
            <h1>🍳 ספר המתכונים שלי</h1>
            <div class="header-actions">
                <span class="user-info">שלום, ${state.currentUser}</span>
                <button class="btn-secondary" onclick="navigateTo('settings')">⚙️ הגדרות</button>
                <button class="btn-secondary" onclick="logout()">יציאה</button>
            </div>
        </div>
        <div class="recipe-list-container">
            <div class="search-add-bar">
                <input type="text" class="search-input" id="searchInput" placeholder="חיפוש מתכון..." value="${state.searchQuery}">
                <button class="btn-add" onclick="openAddRecipeModal()">➕ הוסף מתכון</button>
            </div>
            <div class="recipes-grid">
                ${filteredRecipes.length > 0 ? filteredRecipes.map(recipe => `
                    <div class="recipe-card" onclick="viewRecipe(${recipe.id})">
                        <h3>${recipe.name}</h3>
                        <p><strong>מרכיבים:</strong> ${recipe.ingredients.length} פריטים</p>
                        <p><strong>שלבים:</strong> ${recipe.instructions.length} שלבים</p>
                    </div>
                `).join('') : '<div class="empty-state"><h3>אין מתכונים</h3><p>התחל בהוספת מתכון ראשון!</p></div>'}
            </div>
        </div>
        <div id="addRecipeModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>הוסף מתכון חדש</h2>
                    <button class="close-btn" onclick="closeAddRecipeModal()">&times;</button>
                </div>
                <form id="addRecipeForm">
                    <div class="form-group">
                        <label for="recipeName">שם המתכון</label>
                        <input type="text" id="recipeName" required>
                    </div>
                    <div class="form-group">
                        <label for="recipeIngredients">מרכיבים (כל מרכיב בשורה נפרדת)</label>
                        <textarea id="recipeIngredients" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="recipeInstructions">הוראות הכנה (כל שלב בשורה נפרדת)</label>
                        <textarea id="recipeInstructions" required></textarea>
                    </div>
                    <button type="submit" class="btn">הוסף מתכון</button>
                </form>
            </div>
        </div>
    `;
}

function renderRecipeView() {
    const recipe = state.currentRecipe;
    if (!recipe) return '';

    return `
        <div class="header">
            <h1>🍳 ${recipe.name}</h1>
            <div class="header-actions">
                <button class="btn-secondary" onclick="navigateTo('recipeList')">← חזרה לרשימה</button>
            </div>
        </div>
        <div class="recipe-view-container">
            <div class="recipe-section">
                <h3>🛒 מרכיבים</h3>
                <ul>
                    ${recipe.ingredients.map((ing, idx) => `<li id="ingredient-${idx}">${ing}</li>`).join('')}
                </ul>
            </div>
            <div class="recipe-section">
                <h3>👨‍🍳 הוראות הכנה</h3>
                <ol>
                    ${recipe.instructions.map((inst, idx) => `<li id="step-${idx}">${inst}</li>`).join('')}
                </ol>
            </div>
            <div class="recipe-controls">
                <button class="btn-control btn-play" onclick="startReading()">▶️ התחל הקראה</button>
                <button class="btn-control btn-pause" onclick="pauseReading()">⏸️ השהה</button>
                <button class="btn-control btn-stop" onclick="stopReading()">⏹️ עצור</button>
            </div>
            <div id="readingStatus"></div>
        </div>
    `;
}

function renderSettings() {
    const settings = getUserSettings(state.currentUser);

    return `
        <div class="header">
            <h1>⚙️ הגדרות</h1>
            <div class="header-actions">
                <button class="btn-secondary" onclick="navigateTo('recipeList')">← חזרה</button>
            </div>
        </div>
        <div class="settings-container">
            <h2>הגדרות אישיות</h2>
            
            <div class="setting-item">
                <label>
                    <span class="range-value">${settings.readingDelay}s</span>
                    זמן המתנה בין שורות
                </label>
                <input type="range" id="readingDelay" min="0" max="10" step="0.5" value="${settings.readingDelay}">
            </div>

            <div class="setting-item">
                <label>
                    <span class="range-value">${settings.speechRate}x</span>
                    מהירות הקראה
                </label>
                <input type="range" id="speechRate" min="0.5" max="2" step="0.1" value="${settings.speechRate}">
            </div>

            <div class="setting-item">
                <label>
                    <span class="range-value">${settings.speechPitch}</span>
                    גובה קול
                </label>
                <input type="range" id="speechPitch" min="0" max="2" step="0.1" value="${settings.speechPitch}">
            </div>

            <div class="setting-item">
                <label>ערכת נושא</label>
                <label class="toggle-switch">
                    <input type="checkbox" id="themeToggle" ${settings.theme === 'dark' ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
                <span style="margin-right: 10px;">${settings.theme === 'dark' ? 'כהה' : 'בהיר'}</span>
            </div>

            <div class="setting-item">
                <label>גודל גופן</label>
                <select id="fontSize">
                    <option value="small" ${settings.fontSize === 'small' ? 'selected' : ''}>קטן</option>
                    <option value="medium" ${settings.fontSize === 'medium' ? 'selected' : ''}>בינוני</option>
                    <option value="large" ${settings.fontSize === 'large' ? 'selected' : ''}>גדול</option>
                </select>
            </div>

            <button class="btn" onclick="saveSettings()">שמור הגדרות</button>
        </div>
    `;
}

// Event Handlers
function attachLoginEvents() {
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        const users = JSON.parse(localStorage.getItem('users'));
        
        if (users[username]) {
            if (users[username].password === password) {
                state.currentUser = username;
                localStorage.setItem('currentUser', username);
                navigateTo('recipeList');
            } else {
                document.getElementById('loginError').textContent = 'סיסמה שגויה';
            }
        } else {
            users[username] = {
                password: password,
                settings: {
                    theme: 'light',
                    readingDelay: 2,
                    fontSize: 'medium',
                    speechRate: 1,
                    speechPitch: 1
                }
            };
            localStorage.setItem('users', JSON.stringify(users));
            state.currentUser = username;
            localStorage.setItem('currentUser', username);
            navigateTo('recipeList');
        }
    });
}

function attachRecipeListEvents() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        render();
    });
}

function attachRecipeViewEvents() {
    // Events are handled by onclick attributes
}

function attachSettingsEvents() {
    const readingDelay = document.getElementById('readingDelay');
    const speechRate = document.getElementById('speechRate');
    const speechPitch = document.getElementById('speechPitch');

    readingDelay.addEventListener('input', (e) => {
        e.target.previousElementSibling.querySelector('.range-value').textContent = e.target.value + 's';
    });

    speechRate.addEventListener('input', (e) => {
        e.target.previousElementSibling.querySelector('.range-value').textContent = e.target.value + 'x';
    });

    speechPitch.addEventListener('input', (e) => {
        e.target.previousElementSibling.querySelector('.range-value').textContent = e.target.value;
    });
}

// Navigation
function navigateTo(view) {
    state.currentView = view;
    render();
}

function logout() {
    state.currentUser = null;
    localStorage.removeItem('currentUser');
    stopReading();
    navigateTo('login');
}

// Recipe Management
function viewRecipe(id) {
    state.currentRecipe = state.recipes.find(r => r.id === id);
    navigateTo('recipeView');
}

function openAddRecipeModal() {
    document.getElementById('addRecipeModal').classList.add('active');
    document.getElementById('addRecipeForm').addEventListener('submit', addRecipe);
}

function closeAddRecipeModal() {
    document.getElementById('addRecipeModal').classList.remove('active');
}

function addRecipe(e) {
    e.preventDefault();
    
    const name = document.getElementById('recipeName').value;
    const ingredients = document.getElementById('recipeIngredients').value.split('\n').filter(i => i.trim());
    const instructions = document.getElementById('recipeInstructions').value.split('\n').filter(i => i.trim());
    
    const newRecipe = {
        id: Date.now(),
        name,
        ingredients,
        instructions
    };
    
    state.recipes.push(newRecipe);
    saveRecipes();
    closeAddRecipeModal();
    render();
}

function deleteRecipe(id) {
    if (confirm('האם אתה בטוח שברצונך למחוק מתכון זה?')) {
        state.recipes = state.recipes.filter(r => r.id !== id);
        saveRecipes();
        render();
    }
}

// Settings
function saveSettings() {
    const settings = {
        theme: document.getElementById('themeToggle').checked ? 'dark' : 'light',
        readingDelay: parseFloat(document.getElementById('readingDelay').value),
        fontSize: document.getElementById('fontSize').value,
        speechRate: parseFloat(document.getElementById('speechRate').value),
        speechPitch: parseFloat(document.getElementById('speechPitch').value)
    };
    
    saveUserSettings(state.currentUser, settings);
    applyUserSettings();
    
    const statusDiv = document.createElement('div');
    statusDiv.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: var(--accent); color: white; padding: 15px 30px; border-radius: 8px; z-index: 9999; animation: fadeIn 0.3s;';
    statusDiv.textContent = '✓ ההגדרות נשמרו בהצלחה!';
    document.body.appendChild(statusDiv);
    setTimeout(() => statusDiv.remove(), 2000);
}

function applyUserSettings() {
    const settings = getUserSettings(state.currentUser);
    
    document.documentElement.setAttribute('data-theme', settings.theme);
    
    const fontSizes = { small: '14px', medium: '16px', large: '18px' };
    document.body.style.fontSize = fontSizes[settings.fontSize];
}

// Speech Synthesis
async function startReading() {
    if (!state.currentRecipe) return;
    
    const settings = getUserSettings(state.currentUser);
    const recipe = state.currentRecipe;
    
    if (state.speech.isPaused) {
        state.speech.synthesis.resume();
        state.speech.isPaused = false;
        updateReadingStatus('ממשיך הקראה...');
        return;
    }
    
    stopReading();
    state.speech.currentStep = 0;
    
    updateReadingStatus('מתחיל הקראה...');
    
    await speakText('המרכיבים הנדרשים הם:', settings);
    await sleep(settings.readingDelay * 1000);
    
    for (let i = 0; i < recipe.ingredients.length; i++) {
        if (state.speech.currentStep === -1) return;
        highlightIngredient(i);
        await speakText(recipe.ingredients[i], settings);
        await sleep(settings.readingDelay * 1000);
    }
    
    removeHighlight();
    await sleep(settings.readingDelay * 1000);
    await speakText('עכשיו נתחיל בהוראות ההכנה', settings);
    await sleep(settings.readingDelay * 1000);
    
    for (let i = 0; i < recipe.instructions.length; i++) {
        if (state.speech.currentStep === -1) return;
        
        state.speech.currentStep = i;
        highlightStep(i);
        await speakText(`שלב ${i + 1}. ${recipe.instructions[i]}`, settings);
        
        if (i < recipe.instructions.length - 1) {
            updateReadingStatus(`ממתין ${settings.readingDelay} שניות לפני השלב הבא...`);
            await sleep(settings.readingDelay * 1000);
        }
    }
    
    updateReadingStatus('ההקראה הסתיימה! בתאבון!');
    removeHighlight();
    state.speech.currentStep = 0;
}

function pauseReading() {
    if (state.speech.synthesis.speaking && !state.speech.isPaused) {
        state.speech.synthesis.pause();
        state.speech.isPaused = true;
        updateReadingStatus('ההקראה הושהתה');
    }
}

function stopReading() {
    state.speech.synthesis.cancel();
    state.speech.isPaused = false;
    state.speech.currentStep = -1;
    removeHighlight();
    updateReadingStatus('');
}

function speakText(text, settings) {
    return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'he-IL';
        utterance.rate = settings.speechRate;
        utterance.pitch = settings.speechPitch;
        
        utterance.onend = resolve;
        utterance.onerror = resolve;
        
        state.speech.synthesis.speak(utterance);
    });
}

function highlightIngredient(index) {
    removeHighlight();
    const ingredient = document.getElementById(`ingredient-${index}`);
    if (ingredient) {
        ingredient.style.background = 'var(--accent)';
        ingredient.style.color = 'white';
        ingredient.style.padding = '10px';
        ingredient.style.borderRadius = '8px';
        ingredient.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function highlightStep(index) {
    removeHighlight();
    const step = document.getElementById(`step-${index}`);
    if (step) {
        step.style.background = 'var(--accent)';
        step.style.color = 'white';
        step.style.padding = '10px';
        step.style.borderRadius = '8px';
        step.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function removeHighlight() {
    document.querySelectorAll('[id^="ingredient-"]').forEach(ing => {
        ing.style.background = '';
        ing.style.color = '';
        ing.style.padding = '8px 0';
        ing.style.borderRadius = '';
    });
    document.querySelectorAll('[id^="step-"]').forEach(step => {
        step.style.background = '';
        step.style.color = '';
        step.style.padding = '8px 0';
        step.style.borderRadius = '';
    });
}

function updateReadingStatus(message) {
    const status = document.getElementById('readingStatus');
    if (status) {
        status.innerHTML = message ? `<div class="reading-indicator">${message}</div>` : '';
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize on load
window.addEventListener('DOMContentLoaded', init);
