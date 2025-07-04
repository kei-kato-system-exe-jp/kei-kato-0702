// メインJavaScript - 共通機能とナビゲーション

// DOM読み込み完了時の初期化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// アプリケーション初期化
function initializeApp() {
    // フェードインアニメーション
    addFadeInAnimation();
    
    // ナビゲーションイベントの設定
    setupNavigation();
    
    // 共通イベントリスナーの設定
    setupCommonEventListeners();
    
    // ページ固有の初期化
    initializePageSpecific();
}

// フェードインアニメーション追加
function addFadeInAnimation() {
    const elements = document.querySelectorAll('.fortune-card, .result-container, .selection-card');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ナビゲーション設定
function setupNavigation() {
    // 占い選択ナビゲーション
    window.navigateToFortune = function(fortuneType) {
        const pages = {
            'tarot': 'tarot.html',
            'zodiac': 'zodiac.html',
            'omikuji': 'omikuji.html',
            'numerology': 'numerology.html'
        };
        
        if (pages[fortuneType]) {
            // ページ遷移前のアニメーション
            document.body.style.opacity = '0.8';
            setTimeout(() => {
                window.location.href = pages[fortuneType];
            }, 200);
        }
    };
    
    // ホームに戻る
    window.goHome = function() {
        document.body.style.opacity = '0.8';
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 200);
    };
    
    // 結果ページへ
    window.goToResult = function(fortuneType, result) {
        // 結果をセッションストレージに保存
        sessionStorage.setItem('fortuneResult', JSON.stringify({
            type: fortuneType,
            result: result,
            timestamp: new Date().toISOString()
        }));
        
        document.body.style.opacity = '0.8';
        setTimeout(() => {
            window.location.href = 'result.html';
        }, 200);
    };
}

// 共通イベントリスナー設定
function setupCommonEventListeners() {
    // ボタンホバーエフェクト
    const buttons = document.querySelectorAll('.btn, .card-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // カードクリックエフェクト
    const cards = document.querySelectorAll('.fortune-card, .selection-card, .zodiac-card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            // クリックエフェクト
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // モーダル制御
    setupModalControls();
}

// モーダル制御
function setupModalControls() {
    // モーダルを開く
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    };
    
    // モーダルを閉じる
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    };
    
    // モーダル外クリックで閉じる
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}

// ページ固有の初期化
function initializePageSpecific() {
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index':
            initializeHomePage();
            break;
        case 'tarot':
            initializeTarotPage();
            break;
        case 'zodiac':
            initializeZodiacPage();
            break;
        case 'omikuji':
            initializeOmikujiPage();
            break;
        case 'numerology':
            initializeNumerologyPage();
            break;
        case 'result':
            initializeResultPage();
            break;
    }
}

// 現在のページを取得
function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().split('.')[0];
    return filename || 'index';
}

// ホームページ初期化
function initializeHomePage() {
    // 占いカードのホバーエフェクト強化
    const fortuneCards = document.querySelectorAll('.fortune-card');
    fortuneCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 25px 50px rgba(255, 215, 0, 0.4)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
}

// タロットページ初期化
function initializeTarotPage() {
    if (typeof initializeTarot === 'function') {
        initializeTarot();
    }
}

// 星座ページ初期化
function initializeZodiacPage() {
    if (typeof initializeZodiac === 'function') {
        initializeZodiac();
    }
}

// おみくじページ初期化
function initializeOmikujiPage() {
    if (typeof initializeOmikuji === 'function') {
        initializeOmikuji();
    }
}

// 数秘術ページ初期化
function initializeNumerologyPage() {
    if (typeof initializeNumerology === 'function') {
        initializeNumerology();
    }
}

// 結果ページ初期化
function initializeResultPage() {
    displayFortuneResult();
}

// 結果表示
function displayFortuneResult() {
    const resultData = sessionStorage.getItem('fortuneResult');
    if (!resultData) {
        // 結果がない場合はホームに戻る
        goHome();
        return;
    }
    
    const result = JSON.parse(resultData);
    const resultContainer = document.getElementById('result-content');
    const resultTitle = document.getElementById('result-title');
    
    if (resultContainer && resultTitle) {
        // タイトル設定
        const titles = {
            'tarot': 'タロット占い結果',
            'zodiac': '星座占い結果',
            'omikuji': 'おみくじ結果',
            'numerology': '数秘術結果'
        };
        
        resultTitle.textContent = titles[result.type] || '占い結果';
        
        // 結果内容表示
        if (typeof result.result === 'object') {
            displayStructuredResult(result.result, resultContainer);
        } else {
            resultContainer.innerHTML = `<p class="result-text">${result.result}</p>`;
        }
        
        // 結果をクリア（再表示防止）
        sessionStorage.removeItem('fortuneResult');
    }
}

// 構造化された結果の表示
function displayStructuredResult(result, container) {
    let html = '';
    
    if (result.title) {
        html += `<h3 class="result-subtitle">${result.title}</h3>`;
    }
    
    if (result.description) {
        html += `<p class="result-description">${result.description}</p>`;
    }
    
    if (result.advice) {
        html += `<div class="result-advice">
            <h4>アドバイス</h4>
            <p>${result.advice}</p>
        </div>`;
    }
    
    if (result.lucky) {
        html += `<div class="result-lucky">
            <h4>ラッキーポイント</h4>`;
        
        if (result.lucky.color) {
            html += `<p><strong>ラッキーカラー:</strong> ${result.lucky.color}</p>`;
        }
        
        if (result.lucky.number) {
            html += `<p><strong>ラッキーナンバー:</strong> ${result.lucky.number}</p>`;
        }
        
        if (result.lucky.item) {
            html += `<p><strong>ラッキーアイテム:</strong> ${result.lucky.item}</p>`;
        }
        
        html += `</div>`;
    }
    
    container.innerHTML = html;
}

// ユーティリティ関数
const Utils = {
    // ランダム要素選択
    getRandomElement: function(array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    // ランダム数値生成
    getRandomNumber: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // 配列シャッフル
    shuffleArray: function(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    // 日付フォーマット
    formatDate: function(date) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        return date.toLocaleDateString('ja-JP', options);
    },
    
    // ローディング表示
    showLoading: function(element) {
        element.innerHTML = '<div class="loading"></div><p>占い中...</p>';
    },
    
    // エラー表示
    showError: function(element, message) {
        element.innerHTML = `<div class="error-message">
            <p>エラーが発生しました</p>
            <p>${message}</p>
            <button class="btn" onclick="location.reload()">再試行</button>
        </div>`;
    }
};

// グローバルに公開
window.Utils = Utils;

// パフォーマンス最適化
function optimizePerformance() {
    // 画像の遅延読み込み
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // 不要なイベントリスナーのクリーンアップ
    window.addEventListener('beforeunload', function() {
        // クリーンアップ処理
        document.removeEventListener('click', arguments.callee);
    });
}

// 初期化完了後にパフォーマンス最適化を実行
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(optimizePerformance, 1000);
});

// エラーハンドリング
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // 本番環境では適切なエラー報告を行う
});

// 未処理のPromise拒否をキャッチ
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    e.preventDefault();
});