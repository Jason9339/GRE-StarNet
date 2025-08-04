const fs = require('fs');

function correctVocabData() {
  const vocFiles = ['voc1.txt', 'voc2.txt', 'voc3.txt', 'voc4.txt', 'voc5.txt'];
  const allWords = [];
  const processedWords = new Set();

  vocFiles.forEach(fileName => {
    console.log(`Processing ${fileName}...`);
    const content = fs.readFileSync(fileName, 'utf-8');
    const lines = content.split('\n').slice(1); // 跳過標題行

    lines.forEach(line => {
      if (!line.trim()) return;
      
      // 用逗號分割，但要小心處理引號內的逗號
      const parts = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
          current += char;
        } else if (char === ',' && !inQuotes) {
          parts.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      if (current.trim()) {
        parts.push(current.trim());
      }

      if (parts.length < 3) return;

      const word = parts[0].trim();
      let meaning = parts[1].trim();
      
      // 只移除 meaning 前後的引號，保留內容中的逗號和所有中文
      if (meaning.startsWith('"') && meaning.endsWith('"')) {
        meaning = meaning.slice(1, -1);
      }
      
      const synonyms = [];

      // 提取同義詞（只保留英文，排除中文）
      for (let i = 2; i < parts.length; i++) {
        let synonym = parts[i].trim();
        
        // 移除前後引號
        if (synonym.startsWith('"') && synonym.endsWith('"')) {
          synonym = synonym.slice(1, -1);
        }
        
        // 只保留純英文同義詞（包含字母、空格、連字符），排除包含中文字符的詞
        if (synonym && /^[a-zA-Z\s\-'.]+$/.test(synonym) && !/[\u4e00-\u9fff]/.test(synonym)) {
          synonym = synonym.trim();
          if (synonym.length > 0) {
            synonyms.push(synonym);
          }
        }
      }

      // 避免重複單字並確保有同義詞
      if (!processedWords.has(word) && synonyms.length > 0) {
        processedWords.add(word);
        allWords.push({
          word: word,
          meaning: meaning, // 保留完整的中文意思，包括多個含義
          synonyms: synonyms
        });
      }
    });
  });

  // 排序並寫入檔案
  allWords.sort((a, b) => a.word.localeCompare(b.word));
  
  const jsonContent = JSON.stringify(allWords, null, 2);
  fs.writeFileSync('src/data/star_data.json', jsonContent, 'utf-8');
  
  console.log(`✅ 成功轉換 ${allWords.length} 個單字到 star_data.json`);
  
  // 檢查樣本
  console.log('\n前5個條目樣本:');
  allWords.slice(0, 5).forEach(entry => {
    console.log(`${entry.word}: "${entry.meaning}" -> [${entry.synonyms.join(', ')}]`);
  });
  
  // 檢查 ungainly 的轉換結果
  const ungainly = allWords.find(w => w.word === 'ungainly');
  if (ungainly) {
    console.log('\n檢查 ungainly:');
    console.log(`${ungainly.word}: "${ungainly.meaning}" -> [${ungainly.synonyms.join(', ')}]`);
  }
}

correctVocabData();