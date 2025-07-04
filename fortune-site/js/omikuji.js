// おみくじ専用JavaScript

let shakeCount = 0;
let isShaking = false;
let omikujiResult = null;

// おみくじ初期化
function initializeOmikuji() {
    resetOmikujiState();
    setupOmikujiAnimations();
    showStep(1);
}

// おみくじ状態リセット
function resetOmikujiState() {
    shakeCount = 0;
    isShaking = false;
    omikujiResult = null;
    updateShakeCounter();
}

// おみくじを振る
function shakeOmikuji() {
    if (isShaking || shakeCount >= 3) {
        return;
    }
    
    isShaking = true;
    shakeCount++;
    
    // おみくじ箱の振りアニメーション
    const omikujiBox = document.getElementById('omikuji-box');
    omikujiBox.classList.add('shaking');
    
    // 振り音効果（視覚的表現）
    createShakeEffect(omikujiBox);
    
    // カウンター更新
    updateShakeCounter();
    
    // 振りアニメーション終了後
    setTimeout(() => {
        omikujiBox.classList.remove('shaking');
        isShaking = false;
        
        // 3回振ったら次のステップへ
        if (shakeCount >= 3) {
            setTimeout(() => {
                showOmikujiStick();
            }, 500);
        }
    }, 1000);
}

// 振りエフェクト作成
function createShakeEffect(element) {
    // パーティクルエフェクト
    const particleCount = 10;
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.innerHTML = ['✨', '🌸', '🎋', '⭐'][Math.floor(Math.random() * 4)];
        particle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            font-size: 1.2rem;
            pointer-events: none;
            z-index: 1000;
            animation: shakeParticle 1s ease-out forwards;
            animation-delay: ${i * 0.1}s;
        `;
        
        // ランダムな方向に飛ばす
        const angle = Math.random() * 360;
        const distance = 50 + Math.random() * 50;
        const endX = rect.left + rect.width / 2 + Math.cos(angle * Math.PI / 180) * distance;
        const endY = rect.top + rect.height / 2 + Math.sin(angle * Math.PI / 180) * distance;
        
        particle.style.setProperty('--end-x', `${endX}px`);
        particle.style.setProperty('--end-y', `${endY}px`);
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
    
    // 振動エフェクト
    const vibration = document.createElement('div');
    vibration.style.cssText = `
        position: absolute;
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
        border: 2px solid rgba(255, 215, 0, 0.6);
        border-radius: 25px;
        animation: vibrate 0.1s linear infinite;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.appendChild(vibration);
    
    setTimeout(() => {
        vibration.remove();
    }, 1000);
}

// 振りカウンター更新
function updateShakeCounter() {
    document.getElementById('shake-count').textContent = shakeCount;
    const progress = (shakeCount / 3) * 100;
    document.getElementById('shake-progress').style.width = `${progress}%`;
}

// おみくじ棒表示
function showOmikujiStick() {
    showStep(2);
    
    // 選択された棒にクリックイベント追加
    const selectedStick = document.getElementById('selected-stick');
    selectedStick.addEventListener('click', openOmikujiResult);
    
    // 棒の出現アニメーション
    setTimeout(() => {
        selectedStick.style.transform = 'translateY(0) scale(1)';
        selectedStick.style.opacity = '1';
    }, 300);
}

// おみくじ結果を開く
function openOmikujiResult() {
    const selectedStick = document.getElementById('selected-stick');
    selectedStick.removeEventListener('click', openOmikujiResult);
    
    // 棒を開くアニメーション
    selectedStick.classList.add('opening');
    
    // ローディング画面表示
    setTimeout(() => {
        showStep(3);
        
        // 占い実行
        setTimeout(() => {
            performOmikujiReading();
        }, 2000);
    }, 1000);
}

// おみくじ占い実行
function performOmikujiReading() {
    try {
        // 占いエンジンを使用して結果生成
        const result = fortuneEngine.performOmikujiReading();
        
        // 結果ページに遷移
        goToResult('omikuji', result);
    } catch (error) {
        console.error('おみくじエラー:', error);
        showOmikujiError('占いの実行中にエラーが発生しました。もう一度お試しください。');
    }
}

// おみくじリセット
function resetOmikuji() {
    resetOmikujiState();
    showStep(1);
    
    // アニメーションリセット
    const selectedStick = document.getElementById('selected-stick');
    selectedStick.classList.remove('opening');
    selectedStick.style.transform = 'translateY(20px) scale(0.8)';
    selectedStick.style.opacity = '0';
}

// ステップ表示制御
function showStep(stepNumber) {
    // 全てのステップを非表示
    const steps = document.querySelectorAll('.omikuji-step');
    steps.forEach(step => {
        step.classList.remove('active');
        step.style.display = 'none';
    });
    
    // 指定されたステップを表示
    const targetStep = document.getElementById(`omikuji-step-${stepNumber}`);
    if (targetStep) {
        targetStep.style.display = 'block';
        setTimeout(() => {
            targetStep.classList.add('active');
        }, 50);
    }
}

// おみくじアニメーション設定
function setupOmikujiAnimations() {
    // 背景の桜アニメーション
    createSakuraAnimation();
    
    // おみくじ箱の初期アニメーション
    const omikujiBox = document.getElementById('omikuji-box');
    omikujiBox.style.transform = 'translateY(20px)';
    omikujiBox.style.opacity = '0';
    
    setTimeout(() => {
        omikujiBox.style.transition = 'all 0.8s ease';
        omikujiBox.style.transform = 'translateY(0)';
        omikujiBox.style.opacity = '1';
    }, 300);
}

// 桜アニメーション作成
function createSakuraAnimation() {
    const sakuraCount = 15;
    const container = document.querySelector('.container');
    
    for (let i = 0; i < sakuraCount; i++) {
        const sakura = document.createElement('div');
        sakura.innerHTML = '🌸';
        sakura.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 0.8 + 0.5}rem;
            left: ${Math.random() * 100}%;
            top: -50px;
            animation: sakuraFall ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
            pointer-events: none;
            z-index: -1;
            opacity: 0.7;
        `;
        
        container.appendChild(sakura);
    }
}

// エラー表示
function showOmikujiError(message) {
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

// CSS追加（おみくじ専用スタイル）
const omikujiStyles = `
<style>
.omikuji-step {
    display: none;
    opacity: 0;
    transition: opacity 0.6s ease;
}

.omikuji-step.active {
    display: block;
    opacity: 1;
}

.omikuji-container {
    text-align: center;
    padding: 40px 20px;
}

.omikuji-box {
    width: 200px;
    height: 250px;
    background: linear-gradient(135deg, #8B4513, #D2691E);
    border: 3px solid #654321;
    border-radius: 20px 20px 10px 10px;
    margin: 0 auto 30px;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
    overflow: hidden;
}

.omikuji-box:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(255, 215, 0, 0.3);
}

.omikuji-box.shaking {
    animation: shake 0.1s linear infinite;
}

.omikuji-lid {
    background: linear-gradient(135deg, #CD853F, #DEB887);
    height: 60px;
    border-radius: 15px 15px 0 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-bottom: 2px solid #8B4513;
}

.lid-decoration {
    font-size: 1.5rem;
    margin-bottom: 5px;
}

.lid-text {
    font-size: 0.9rem;
    font-weight: bold;
    color: #654321;
}

.omikuji-sticks {
    padding: 20px;
    height: 140px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 3px;
}

.stick {
    width: 8px;
    height: 80px;
    background: linear-gradient(to bottom, #DEB887, #CD853F);
    border-radius: 4px;
    animation: stickFloat 2s ease-in-out infinite;
    animation-delay: var(--delay, 0s);
}

.omikuji-instruction {
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    font-size: 0.8rem;
    color: #DEB887;
    font-weight: bold;
}

.shake-counter {
    margin-top: 20px;
}

.shake-counter p {
    font-size: 1.1rem;
    color: #ffd700;
    margin-bottom: 10px;
}

.omikuji-stick-result {
    text-align: center;
    padding: 40px 20px;
}

.selected-stick {
    width: 150px;
    height: 200px;
    margin: 0 auto 30px;
    cursor: pointer;
    transform: translateY(20px) scale(0.8);
    opacity: 0;
    transition: all 0.6s ease;
    position: relative;
}

.selected-stick:hover {
    transform: translateY(-5px) scale(1.05);
}

.stick-paper {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #FFF8DC, #F5F5DC);
    border: 2px solid #DEB887;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

.selected-stick.opening .stick-paper {
    transform: rotateY(180deg);
}

.paper-content {
    text-align: center;
}

.paper-decoration {
    font-size: 2rem;
    margin-bottom: 15px;
}

.paper-text {
    font-size: 1.2rem;
    font-weight: bold;
    color: #654321;
}

.loading-container {
    text-align: center;
    padding: 60px 20px;
}

.loading-container .loading {
    margin: 0 auto 20px;
}

.loading-container p {
    font-size: 1.2rem;
    color: #e6e6fa;
    margin-top: 20px;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px) rotate(-1deg); }
    75% { transform: translateX(5px) rotate(1deg); }
}

@keyframes stickFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

@keyframes shakeParticle {
    0% {
        transform: translate(0, 0) scale(1);
        opacity: 1;
    }
    100% {
        transform: translate(var(--end-x, 0), var(--end-y, 0)) scale(0);
        opacity: 0;
    }
}

@keyframes vibrate {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(-2px, -2px); }
    50% { transform: translate(2px, -2px); }
    75% { transform: translate(-2px, 2px); }
}

@keyframes sakuraFall {
    0% {
        transform: translateY(-50px) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 0.7;
    }
    90% {
        opacity: 0.7;
    }
    100% {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
    }
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
    .omikuji-box {
        width: 160px;
        height: 200px;
    }
    
    .omikuji-lid {
        height: 50px;
    }
    
    .lid-decoration {
        font-size: 1.2rem;
    }
    
    .lid-text {
        font-size: 0.8rem;
    }
    
    .omikuji-sticks {
        height: 110px;
        padding: 15px;
    }
    
    .stick {
        width: 6px;
        height: 60px;
    }
    
    .selected-stick {
        width: 120px;
        height: 160px;
    }
    
    .paper-decoration {
        font-size: 1.5rem;
        margin-bottom: 10px;
    }
    
    .paper-text {
        font-size: 1rem;
    }
}

@media (max-width: 480px) {
    .omikuji-container {
        padding: 30px 15px;
    }
    
    .omikuji-box {
        width: 140px;
        height: 180px;
    }
    
    .omikuji-lid {
        height: 40px;
    }
    
    .lid-decoration {
        font-size: 1rem;
    }
    
    .lid-text {
        font-size: 0.7rem;
    }
    
    .omikuji-sticks {
        height: 100px;
        padding: 10px;
    }
    
    .stick {
        width: 5px;
        height: 50px;
    }
    
    .selected-stick {
        width: 100px;
        height: 140px;
    }
    
    .paper-decoration {
        font-size: 1.2rem;
    }
    
    .paper-text {
        font-size: 0.9rem;
    }
    
    .shake-counter p {
        font-size: 1rem;
    }
}
</style>
`;

// スタイルを追加
document.head.insertAdjacentHTML('beforeend', omikujiStyles);

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    if (getCurrentPage() === 'omikuji') {
        initializeOmikuji();
    }
});