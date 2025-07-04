// 数秘術専用JavaScript

let selectedDate = {
    year: null,
    month: null,
    day: null
};

// 数秘術初期化
function initializeNumerology() {
    setupDateSelectors();
    setupEventListeners();
    showStep(1);
}

// 日付セレクター設定
function setupDateSelectors() {
    setupYearSelector();
    setupMonthSelector();
    setupDaySelector();
}

// 年セレクター設定
function setupYearSelector() {
    const yearSelect = document.getElementById('birth-year');
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 100;
    
    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year + '年';
        yearSelect.appendChild(option);
    }
}

// 月セレクター設定
function setupMonthSelector() {
    const monthSelect = document.getElementById('birth-month');
    const months = [
        '1月', '2月', '3月', '4月', '5月', '6月',
        '7月', '8月', '9月', '10月', '11月', '12月'
    ];
    
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = month;
        monthSelect.appendChild(option);
    });
}

// 日セレクター設定
function setupDaySelector() {
    const daySelect = document.getElementById('birth-day');
    
    for (let day = 1; day <= 31; day++) {
        const option = document.createElement('option');
        option.value = day;
        option.textContent = day + '日';
        daySelect.appendChild(option);
    }
}

// イベントリスナー設定
function setupEventListeners() {
    const yearSelect = document.getElementById('birth-year');
    const monthSelect = document.getElementById('birth-month');
    const daySelect = document.getElementById('birth-day');
    
    yearSelect.addEventListener('change', () => {
        selectedDate.year = parseInt(yearSelect.value) || null;
        updateCalculationPreview();
        updateCalculateButton();
        addSelectionEffect(yearSelect);
    });
    
    monthSelect.addEventListener('change', () => {
        selectedDate.month = parseInt(monthSelect.value) || null;
        updateDayOptions();
        updateCalculationPreview();
        updateCalculateButton();
        addSelectionEffect(monthSelect);
    });
    
    daySelect.addEventListener('change', () => {
        selectedDate.day = parseInt(daySelect.value) || null;
        updateCalculationPreview();
        updateCalculateButton();
        addSelectionEffect(daySelect);
    });
}

// 日オプション更新（月に応じて）
function updateDayOptions() {
    const daySelect = document.getElementById('birth-day');
    const selectedDay = selectedDate.day;
    
    // 既存のオプションをクリア（最初のオプション以外）
    while (daySelect.children.length > 1) {
        daySelect.removeChild(daySelect.lastChild);
    }
    
    if (!selectedDate.year || !selectedDate.month) {
        return;
    }
    
    // その月の日数を取得
    const daysInMonth = new Date(selectedDate.year, selectedDate.month, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
        const option = document.createElement('option');
        option.value = day;
        option.textContent = day + '日';
        daySelect.appendChild(option);
    }
    
    // 以前選択されていた日が有効な場合は再選択
    if (selectedDay && selectedDay <= daysInMonth) {
        daySelect.value = selectedDay;
        selectedDate.day = selectedDay;
    } else {
        daySelect.value = '';
        selectedDate.day = null;
    }
}

// 選択エフェクト追加
function addSelectionEffect(element) {
    element.style.transform = 'scale(1.05)';
    element.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.5)';
    
    setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.boxShadow = '';
    }, 300);
}

// 計算プレビュー更新
function updateCalculationPreview() {
    const display = document.getElementById('calculation-display');
    
    if (!selectedDate.year || !selectedDate.month || !selectedDate.day) {
        display.innerHTML = '<p>生年月日を入力すると計算過程が表示されます</p>';
        return;
    }
    
    const calculation = calculateLifePathPreview(selectedDate.year, selectedDate.month, selectedDate.day);
    display.innerHTML = calculation;
}

// ライフパスナンバー計算プレビュー
function calculateLifePathPreview(year, month, day) {
    let html = '<div class="calculation-steps">';
    
    // ステップ1: 各数字を表示
    html += `<div class="step">
        <h4>ステップ1: 生年月日の数字</h4>
        <p>${year}年 ${month}月 ${day}日</p>
    </div>`;
    
    // ステップ2: 各数字を足す
    const sum = year + month + day;
    html += `<div class="step">
        <h4>ステップ2: 数字を足す</h4>
        <p>${year} + ${month} + ${day} = ${sum}</p>
    </div>`;
    
    // ステップ3: 1桁になるまで足し続ける
    let currentSum = sum;
    let steps = [];
    
    while (currentSum > 9 && currentSum !== 11 && currentSum !== 22 && currentSum !== 33) {
        const digits = currentSum.toString().split('').map(Number);
        const newSum = digits.reduce((a, b) => a + b, 0);
        steps.push(`${digits.join(' + ')} = ${newSum}`);
        currentSum = newSum;
    }
    
    if (steps.length > 0) {
        html += `<div class="step">
            <h4>ステップ3: 1桁になるまで足し続ける</h4>`;
        steps.forEach(step => {
            html += `<p>${step}</p>`;
        });
        html += `</div>`;
    }
    
    // 結果
    html += `<div class="step result-step">
        <h4>ライフパスナンバー</h4>
        <div class="life-path-number">${currentSum}</div>
    </div>`;
    
    html += '</div>';
    return html;
}

// 計算ボタン更新
function updateCalculateButton() {
    const button = document.getElementById('calculate-btn');
    const isComplete = selectedDate.year && selectedDate.month && selectedDate.day;
    
    button.disabled = !isComplete;
    
    if (isComplete) {
        button.classList.add('ready');
        button.style.background = 'linear-gradient(45deg, #ffd700, #ffed4e)';
        button.style.boxShadow = '0 5px 15px rgba(255, 215, 0, 0.4)';
    } else {
        button.classList.remove('ready');
        button.style.background = '';
        button.style.boxShadow = '';
    }
}

// 数秘術計算実行
function calculateNumerology() {
    if (!selectedDate.year || !selectedDate.month || !selectedDate.day) {
        alert('生年月日を正しく入力してください。');
        return;
    }
    
    // 日付の妥当性チェック
    const date = new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day);
    if (date.getFullYear() !== selectedDate.year || 
        date.getMonth() !== selectedDate.month - 1 || 
        date.getDate() !== selectedDate.day) {
        alert('正しい日付を入力してください。');
        return;
    }
    
    // 未来の日付チェック
    if (date > new Date()) {
        alert('未来の日付は入力できません。');
        return;
    }
    
    // ローディング画面表示
    showStep(2);
    
    // 数字アニメーション開始
    startNumberAnimation();
    
    // 計算実行（3秒後）
    setTimeout(() => {
        performNumerologyReading();
    }, 3000);
}

// 数字アニメーション開始
function startNumberAnimation() {
    const numbers = document.querySelectorAll('.rotating-numbers span');
    
    numbers.forEach((number, index) => {
        number.style.animationDelay = `${index * 0.1}s`;
        number.classList.add('rotating');
    });
}

// 数秘術占い実行
function performNumerologyReading() {
    try {
        const birthDate = new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day);
        const result = fortuneEngine.performNumerologyReading(birthDate);
        
        // 結果ページに遷移
        goToResult('numerology', result);
    } catch (error) {
        console.error('数秘術エラー:', error);
        showNumerologyError('占いの実行中にエラーが発生しました。もう一度お試しください。');
    }
}

// ステップ表示制御
function showStep(stepNumber) {
    // 全てのステップを非表示
    const steps = document.querySelectorAll('.numerology-step');
    steps.forEach(step => {
        step.classList.remove('active');
        step.style.display = 'none';
    });
    
    // 指定されたステップを表示
    const targetStep = document.getElementById(`numerology-step-${stepNumber}`);
    if (targetStep) {
        targetStep.style.display = 'block';
        setTimeout(() => {
            targetStep.classList.add('active');
        }, 50);
    }
}

// エラー表示
function showNumerologyError(message) {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <div class="result-container">
            <h2 class="result-title">エラー</h2>
            <div class="error-message">
                <p>${message}</p>
                <div class="nav-buttons">
                    <button class="btn" onclick="location.reload()">再試行</button>
                    <button class="btn btn-secondary" onclick="goHome()">ホームに戻る</button>
                </div>
            </div>
        </div>
    `;
}

// CSS追加（数秘術専用スタイル）
const numerologyStyles = `
<style>
.numerology-step {
    display: none;
    opacity: 0;
    transition: opacity 0.6s ease;
}

.numerology-step.active {
    display: block;
    opacity: 1;
}

.date-input-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

.date-input-group {
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-bottom: 40px;
    flex-wrap: wrap;
}

.input-group {
    flex: 1;
    min-width: 120px;
}

.date-select {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid rgba(255, 215, 0, 0.3);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.date-select:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.date-select option {
    background: #2d1b69;
    color: #ffffff;
}

.calculation-preview {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 215, 0, 0.2);
    border-radius: 15px;
    padding: 25px;
    margin-bottom: 30px;
}

.calculation-preview h3 {
    color: #ffd700;
    margin-bottom: 15px;
    text-align: center;
}

.calculation-display {
    min-height: 100px;
    color: #e6e6fa;
}

.calculation-steps {
    text-align: left;
}

.step {
    margin-bottom: 20px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    border-left: 4px solid rgba(255, 215, 0, 0.5);
}

.step h4 {
    color: #ffd700;
    margin-bottom: 8px;
    font-size: 1rem;
}

.step p {
    margin: 5px 0;
    font-size: 0.9rem;
}

.result-step {
    border-left-color: #ffd700;
    background: rgba(255, 215, 0, 0.1);
    text-align: center;
}

.life-path-number {
    font-size: 3rem;
    font-weight: bold;
    color: #ffd700;
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
    margin: 10px 0;
}

.number-animation {
    text-align: center;
    margin: 40px 0;
}

.rotating-numbers {
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
}

.rotating-numbers span {
    display: inline-block;
    width: 50px;
    height: 50px;
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #2d1b69;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
    animation: numberRotate 2s ease-in-out infinite;
}

.rotating-numbers span.rotating {
    animation: numberRotate 0.5s ease-in-out infinite;
}

.loading-container {
    text-align: center;
    padding: 60px 20px;
}

.loading-container p {
    font-size: 1.2rem;
    color: #e6e6fa;
    margin-top: 30px;
}

.btn.ready {
    animation: buttonPulse 2s ease-in-out infinite;
}

@keyframes numberRotate {
    0%, 100% {
        transform: rotateY(0deg) scale(1);
    }
    50% {
        transform: rotateY(180deg) scale(1.1);
    }
}

@keyframes buttonPulse {
    0%, 100% {
        transform: scale(1);
        box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
    }
    50% {
        transform: scale(1.05);
        box-shadow: 0 10px 25px rgba(255, 215, 0, 0.6);
    }
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
    .date-input-group {
        flex-direction: column;
        gap: 15px;
    }
    
    .input-group {
        min-width: auto;
    }
    
    .calculation-preview {
        padding: 20px;
    }
    
    .step {
        padding: 12px;
    }
    
    .life-path-number {
        font-size: 2.5rem;
    }
    
    .rotating-numbers span {
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
    }
}

@media (max-width: 480px) {
    .date-input-container {
        padding: 15px;
    }
    
    .calculation-preview {
        padding: 15px;
    }
    
    .step {
        padding: 10px;
    }
    
    .step h4 {
        font-size: 0.9rem;
    }
    
    .step p {
        font-size: 0.8rem;
    }
    
    .life-path-number {
        font-size: 2rem;
    }
    
    .rotating-numbers {
        gap: 8px;
    }
    
    .rotating-numbers span {
        width: 35px;
        height: 35px;
        font-size: 1rem;
    }
}
</style>
`;

// スタイルを追加
document.head.insertAdjacentHTML('beforeend', numerologyStyles);

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    if (getCurrentPage() === 'numerology') {
        initializeNumerology();
    }
});