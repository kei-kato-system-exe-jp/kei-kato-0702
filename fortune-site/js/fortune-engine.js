// 占いエンジン - 各占いの共通ロジックと結果生成

// 占いエンジンクラス
class FortuneEngine {
    constructor() {
        this.fortuneData = {};
        this.loadFortuneData();
    }

    // 占いデータの読み込み
    async loadFortuneData() {
        try {
            // タロットデータ
            this.fortuneData.tarot = await this.loadJSON('assets/data/tarot-data.json');
            // 星座データ
            this.fortuneData.zodiac = await this.loadJSON('assets/data/zodiac-data.json');
            // おみくじデータ
            this.fortuneData.omikuji = await this.loadJSON('assets/data/omikuji-data.json');
        } catch (error) {
            console.warn('占いデータの読み込みに失敗しました。デフォルトデータを使用します。', error);
            this.loadDefaultData();
        }
    }

    // JSONファイル読み込み
    async loadJSON(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.warn(`${url} の読み込みに失敗:`, error);
            return null;
        }
    }

    // デフォルトデータの読み込み
    loadDefaultData() {
        this.fortuneData = {
            tarot: this.getDefaultTarotData(),
            zodiac: this.getDefaultZodiacData(),
            omikuji: this.getDefaultOmikujiData()
        };
    }

    // タロット占い実行
    performTarotReading(selectedCards) {
        const tarotData = this.fortuneData.tarot || this.getDefaultTarotData();
        const results = [];

        selectedCards.forEach((cardIndex, position) => {
            const card = tarotData.cards[cardIndex];
            const isReversed = Math.random() < 0.3; // 30%の確率で逆位置
            
            results.push({
                position: position,
                card: card,
                isReversed: isReversed,
                meaning: isReversed ? card.reversedMeaning : card.uprightMeaning
            });
        });

        return this.generateTarotResult(results);
    }

    // 星座占い実行
    performZodiacReading(zodiacSign) {
        const zodiacData = this.fortuneData.zodiac || this.getDefaultZodiacData();
        const sign = zodiacData.signs.find(s => s.name === zodiacSign);
        
        if (!sign) {
            return this.generateErrorResult('星座が見つかりません');
        }

        const today = new Date();
        const fortune = this.calculateZodiacFortune(sign, today);
        
        return this.generateZodiacResult(sign, fortune);
    }

    // おみくじ実行
    performOmikujiReading() {
        const omikujiData = this.fortuneData.omikuji || this.getDefaultOmikujiData();
        const randomResult = Utils.getRandomElement(omikujiData.results);
        
        return this.generateOmikujiResult(randomResult);
    }

    // 数秘術実行
    performNumerologyReading(birthDate) {
        const lifePathNumber = this.calculateLifePathNumber(birthDate);
        const numerologyData = this.getNumerologyData();
        const result = numerologyData[lifePathNumber];
        
        return this.generateNumerologyResult(lifePathNumber, result);
    }

    // タロット結果生成
    generateTarotResult(cardResults) {
        let interpretation = '';
        let advice = '';
        let overall = '';

        if (cardResults.length === 1) {
            // 1枚引きの場合
            const card = cardResults[0];
            interpretation = `選ばれたカードは「${card.card.name}」です。`;
            interpretation += card.isReversed ? '（逆位置）' : '（正位置）';
            interpretation += `\n\n${card.meaning}`;
            
            advice = this.generateTarotAdvice(card);
            overall = this.generateTarotOverall([card]);
        } else {
            // 3枚引きの場合
            const positions = ['過去', '現在', '未来'];
            cardResults.forEach((card, index) => {
                interpretation += `【${positions[index]}】${card.card.name}`;
                interpretation += card.isReversed ? '（逆位置）\n' : '（正位置）\n';
                interpretation += `${card.meaning}\n\n`;
            });
            
            advice = this.generateTarotAdvice(cardResults);
            overall = this.generateTarotOverall(cardResults);
        }

        return {
            title: 'タロット占い結果',
            description: interpretation,
            advice: advice,
            overall: overall,
            lucky: this.generateLuckyItems('tarot')
        };
    }

    // 星座結果生成
    generateZodiacResult(sign, fortune) {
        return {
            title: `${sign.name}の今日の運勢`,
            description: `${sign.description}\n\n今日のあなたの運勢は${fortune.level}です。`,
            advice: fortune.advice,
            lucky: {
                color: fortune.luckyColor,
                number: fortune.luckyNumber,
                item: fortune.luckyItem
            }
        };
    }

    // おみくじ結果生成
    generateOmikujiResult(result) {
        return {
            title: result.level,
            description: result.description,
            advice: result.advice,
            lucky: {
                color: result.luckyColor,
                number: result.luckyNumber,
                item: result.luckyItem
            }
        };
    }

    // 数秘術結果生成
    generateNumerologyResult(lifePathNumber, result) {
        return {
            title: `ライフパスナンバー ${lifePathNumber}`,
            description: result.description,
            advice: result.advice,
            lucky: {
                color: result.luckyColor,
                number: lifePathNumber,
                item: result.luckyItem
            }
        };
    }

    // ライフパスナンバー計算
    calculateLifePathNumber(birthDate) {
        const date = new Date(birthDate);
        let sum = date.getFullYear() + (date.getMonth() + 1) + date.getDate();
        
        // 数字を1桁になるまで足し続ける（11, 22, 33は例外）
        while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
            sum = sum.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
        }
        
        return sum;
    }

    // 星座運勢計算
    calculateZodiacFortune(sign, date) {
        const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
        const fortuneIndex = (dayOfYear + sign.id) % 5;
        
        const fortuneLevels = [
            {
                level: '大吉',
                advice: '今日は絶好調！新しいことにチャレンジしてみましょう。',
                luckyColor: '金色',
                luckyNumber: 7,
                luckyItem: '鏡'
            },
            {
                level: '吉',
                advice: '良い一日になりそうです。積極的に行動しましょう。',
                luckyColor: '青色',
                luckyNumber: 3,
                luckyItem: '本'
            },
            {
                level: '中吉',
                advice: '安定した一日です。計画的に物事を進めましょう。',
                luckyColor: '緑色',
                luckyNumber: 5,
                luckyItem: '植物'
            },
            {
                level: '小吉',
                advice: '小さな幸せを見つけられる日です。周りに感謝しましょう。',
                luckyColor: '黄色',
                luckyNumber: 2,
                luckyItem: '手紙'
            },
            {
                level: '末吉',
                advice: '慎重に行動すれば良い結果が得られるでしょう。',
                luckyColor: '紫色',
                luckyNumber: 8,
                luckyItem: '石'
            }
        ];
        
        return fortuneLevels[fortuneIndex];
    }

    // タロットアドバイス生成
    generateTarotAdvice(cardResults) {
        const cards = Array.isArray(cardResults) ? cardResults : [cardResults];
        const adviceTemplates = [
            'カードが示すように、{action}することが重要です。',
            '{emotion}を大切にして、{action}してください。',
            '今は{timing}の時期です。{action}することをお勧めします。'
        ];
        
        const actions = ['前向きに進む', '慎重に考える', '新しい挑戦をする', '人との繋がりを大切にする'];
        const emotions = ['直感', '情熱', '冷静さ', '優しさ'];
        const timings = ['行動する', '待つ', '準備する', '決断する'];
        
        const template = Utils.getRandomElement(adviceTemplates);
        return template
            .replace('{action}', Utils.getRandomElement(actions))
            .replace('{emotion}', Utils.getRandomElement(emotions))
            .replace('{timing}', Utils.getRandomElement(timings));
    }

    // タロット総合運生成
    generateTarotOverall(cardResults) {
        const positiveCount = cardResults.filter(card => !card.isReversed).length;
        const total = cardResults.length;
        
        if (positiveCount === total) {
            return '全体的に非常に良い運勢です。自信を持って行動しましょう。';
        } else if (positiveCount > total / 2) {
            return '概ね良い運勢です。少し注意深く進めば成功できるでしょう。';
        } else if (positiveCount === total / 2) {
            return 'バランスの取れた運勢です。慎重に判断して進みましょう。';
        } else {
            return '挑戦的な時期ですが、困難を乗り越えれば成長できるでしょう。';
        }
    }

    // ラッキーアイテム生成
    generateLuckyItems(fortuneType) {
        const luckyItems = {
            tarot: {
                colors: ['紫', '金', '銀', '深青', '白'],
                numbers: [1, 3, 7, 9, 11],
                items: ['クリスタル', 'ペンダント', '香り', '花', '本']
            },
            zodiac: {
                colors: ['赤', '青', '緑', '黄', '紫'],
                numbers: [2, 4, 6, 8, 10],
                items: ['星のアクセサリー', '香水', '手帳', '写真', '音楽']
            },
            omikuji: {
                colors: ['白', '赤', '金', '緑', '青'],
                numbers: [1, 5, 7, 8, 9],
                items: ['お守り', '鈴', '扇子', '竹', '石']
            },
            numerology: {
                colors: ['金', '銀', '紫', '青', '緑'],
                numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                items: ['数字のアクセサリー', '時計', '計算機', '本', 'ペン']
            }
        };
        
        const items = luckyItems[fortuneType] || luckyItems.tarot;
        
        return {
            color: Utils.getRandomElement(items.colors),
            number: Utils.getRandomElement(items.numbers),
            item: Utils.getRandomElement(items.items)
        };
    }

    // エラー結果生成
    generateErrorResult(message) {
        return {
            title: 'エラー',
            description: message,
            advice: 'もう一度お試しください。',
            lucky: null
        };
    }

    // デフォルトタロットデータ
    getDefaultTarotData() {
        return {
            cards: [
                { name: '愚者', uprightMeaning: '新しい始まり、純粋さ、自由', reversedMeaning: '軽率、無責任、混乱' },
                { name: '魔術師', uprightMeaning: '意志力、創造性、実現', reversedMeaning: '悪用、欺瞞、未熟' },
                { name: '女教皇', uprightMeaning: '直感、神秘、内なる知恵', reversedMeaning: '秘密、隠蔽、表面的' },
                { name: '女帝', uprightMeaning: '豊穣、母性、創造', reversedMeaning: '依存、過保護、停滞' },
                { name: '皇帝', uprightMeaning: '権威、安定、統制', reversedMeaning: '独裁、頑固、権力乱用' },
                { name: '教皇', uprightMeaning: '伝統、教え、精神的指導', reversedMeaning: '独断、偏見、形式主義' },
                { name: '恋人', uprightMeaning: '愛、調和、選択', reversedMeaning: '不調和、誘惑、間違った選択' },
                { name: '戦車', uprightMeaning: '勝利、意志力、前進', reversedMeaning: '敗北、暴走、方向性の喪失' },
                { name: '力', uprightMeaning: '内なる力、勇気、忍耐', reversedMeaning: '弱さ、自制心の欠如、暴力' },
                { name: '隠者', uprightMeaning: '内省、探求、導き', reversedMeaning: '孤立、頑固、拒絶' }
            ]
        };
    }

    // デフォルト星座データ
    getDefaultZodiacData() {
        return {
            signs: [
                { id: 1, name: '牡羊座', description: '情熱的で行動力のあるあなた' },
                { id: 2, name: '牡牛座', description: '安定を求める堅実なあなた' },
                { id: 3, name: '双子座', description: '好奇心旺盛で社交的なあなた' },
                { id: 4, name: '蟹座', description: '感情豊かで家族思いのあなた' },
                { id: 5, name: '獅子座', description: '自信に満ちたリーダー気質のあなた' },
                { id: 6, name: '乙女座', description: '完璧主義で分析力のあるあなた' },
                { id: 7, name: '天秤座', description: 'バランス感覚に優れた平和主義のあなた' },
                { id: 8, name: '蠍座', description: '深い洞察力を持つ神秘的なあなた' },
                { id: 9, name: '射手座', description: '自由を愛する冒険家のあなた' },
                { id: 10, name: '山羊座', description: '責任感が強く目標達成型のあなた' },
                { id: 11, name: '水瓶座', description: '独創的で未来志向のあなた' },
                { id: 12, name: '魚座', description: '想像力豊かで共感力の高いあなた' }
            ]
        };
    }

    // デフォルトおみくじデータ
    getDefaultOmikujiData() {
        return {
            results: [
                {
                    level: '大吉',
                    description: '素晴らしい運気に恵まれています。何事も積極的に取り組みましょう。',
                    advice: '今日は特別な日になりそうです。新しいことにチャレンジしてみてください。',
                    luckyColor: '金色',
                    luckyNumber: 7,
                    luckyItem: '鏡'
                },
                {
                    level: '中吉',
                    description: '安定した運気です。計画的に物事を進めれば良い結果が得られるでしょう。',
                    advice: '焦らずに一歩一歩進んでいけば、必ず目標に到達できます。',
                    luckyColor: '青色',
                    luckyNumber: 5,
                    luckyItem: '本'
                },
                {
                    level: '小吉',
                    description: '小さな幸せが訪れる予感です。周りの人への感謝を忘れずに。',
                    advice: '些細なことにも喜びを見つけて、感謝の気持ちを大切にしましょう。',
                    luckyColor: '緑色',
                    luckyNumber: 3,
                    luckyItem: '花'
                },
                {
                    level: '末吉',
                    description: '慎重に行動すれば良い方向に向かいます。急がず着実に進みましょう。',
                    advice: '今は準備の時期です。基礎をしっかりと固めることが大切です。',
                    luckyColor: '黄色',
                    luckyNumber: 2,
                    luckyItem: '石'
                }
            ]
        };
    }

    // 数秘術データ
    getNumerologyData() {
        return {
            1: {
                description: 'リーダーシップに優れ、独立心が強いあなた。新しい道を切り開く力があります。',
                advice: '自分の直感を信じて、積極的に行動しましょう。',
                luckyColor: '赤',
                luckyItem: '赤いペン'
            },
            2: {
                description: '協調性があり、人との調和を大切にするあなた。チームワークが得意です。',
                advice: '周りの人との関係を大切にして、協力し合いましょう。',
                luckyColor: '青',
                luckyItem: 'ペアのアクセサリー'
            },
            3: {
                description: '創造性豊かで表現力があるあなた。芸術的な才能に恵まれています。',
                advice: '自分の創造性を活かして、新しい表現方法を試してみましょう。',
                luckyColor: '黄',
                luckyItem: '筆記用具'
            },
            4: {
                description: '堅実で責任感が強いあなた。コツコツと努力を積み重ねることができます。',
                advice: '基礎をしっかりと固めて、着実に目標に向かいましょう。',
                luckyColor: '緑',
                luckyItem: '手帳'
            },
            5: {
                description: '自由を愛し、変化を求めるあなた。新しい経験を積極的に求めます。',
                advice: '変化を恐れずに、新しい挑戦を楽しみましょう。',
                luckyColor: '紫',
                luckyItem: '旅行用品'
            },
            6: {
                description: '愛情深く、家族や友人を大切にするあなた。人の世話をするのが得意です。',
                advice: '愛する人たちとの時間を大切にして、絆を深めましょう。',
                luckyColor: 'ピンク',
                luckyItem: '写真'
            },
            7: {
                description: '探求心が強く、精神的な成長を求めるあなた。深く考える力があります。',
                advice: '内面と向き合い、自分自身を深く理解しましょう。',
                luckyColor: '紫',
                luckyItem: '本'
            },
            8: {
                description: '野心的で成功を求めるあなた。物質的な豊かさを築く力があります。',
                advice: '目標を明確にして、計画的に成功に向かいましょう。',
                luckyColor: '金',
                luckyItem: '時計'
            },
            9: {
                description: '人道的で理想主義のあなた。世界をより良くしたいという願いがあります。',
                advice: '自分の理想を大切にして、社会貢献を考えてみましょう。',
                luckyColor: '白',
                luckyItem: 'ボランティア活動'
            },
            11: {
                description: '直感力が鋭く、スピリチュアルな能力があるあなた。人を導く力があります。',
                advice: '直感を信じて、精神的な成長を大切にしましょう。',
                luckyColor: '銀',
                luckyItem: 'クリスタル'
            },
            22: {
                description: '大きな夢を実現する力があるあなた。世界に影響を与える可能性があります。',
                advice: '大きな目標を持って、着実に実現に向けて進みましょう。',
                luckyColor: '金',
                luckyItem: '設計図'
            },
            33: {
                description: '愛と奉仕の精神を持つあなた。多くの人を癒し、導く使命があります。',
                advice: '愛の力で人々を癒し、世界に平和をもたらしましょう。',
                luckyColor: '虹色',
                luckyItem: 'ヒーリンググッズ'
            }
        };
    }
}

// グローバルインスタンス作成
const fortuneEngine = new FortuneEngine();

// グローバルに公開
window.FortuneEngine = FortuneEngine;
window.fortuneEngine = fortuneEngine;