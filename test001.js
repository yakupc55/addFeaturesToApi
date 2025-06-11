// JavaScript nesnesi
const jsObject = {
  title: "İngilizce-Türkçe Kelime Testi",
  type: "word",
  questions: [
    {
      question: "apple",
      options: ["elma", "armut", "portakal", "muz"],
      answer: "elma",
      explanation: "Apple İngilizcede elma demektir."
    },
    {
      question: "book",
      options: ["kalem", "defter", "kitap", "silgi"],
      answer: "kitap",
      explanation: "Book İngilizcede kitap demektir."
    }
  ]
};



/*function splitDataByLevel(data: string, splitLevel: number): string[] {
    // Emoji array'ı tanımlıyoruz
    const emojiArray: string[] = ["🧲","🚀", "🌟", "⚡","📡","🪛","🛢️","🧫"];

    // Split level'in geçerli olup olmadığını kontrol ediyoruz
    if (splitLevel < 0 || splitLevel >= emojiArray.length) {
        throw new Error(`Geçersiz splitLevel değeri. Level 0 ile ${emojiArray.length - 1} arasında olmalıdır.`);
    }

    // Seçilen emoji'yi alıyoruz
    const selectedEmoji: string = emojiArray[splitLevel];

    // String'i seçilen emojiye göre bölüyoruz
    const resultArray: string[] = data.split(selectedEmoji);

    return resultArray;
}*/

function joinDataByLevel(dataArray, splitLevel) {
    // Emoji array'ı tanımlıyoruz
    const emojiArray= ["🧲", "🚀", "🌟", "⚡", "📡", "🪛", "🛢️", "🧫"];

    // Split level'in geçerli olup olmadığını kontrol ediyoruz
    if (splitLevel < 0 || splitLevel >= emojiArray.length) {
        throw new Error(`Geçersiz splitLevel değeri. Level 0 ile ${emojiArray.length - 1} arasında olmalıdır.`);
    }

    // Seçilen emoji'yi alıyoruz
    const selectedEmoji= emojiArray[splitLevel];

    // Diziyi seçilen emoji ile birleştiriyoruz
    const resultString= dataArray.join(selectedEmoji);

    return resultString;
}

function joinDataToEmojiText(data,level) {
    // Emoji array'ı tanımlıyoruz
 const emojiArray = ["🚀", "🌟", "⚡","🛢️","🧫"];

    let dataText=""; 
    for (const key in data) {
      dataText +=key+emojiArray[level+1];
      if(typeof data[key] ==="object"){
        if(Array.isArray(data[key])){
          for (const value of data[key]) {
            if(typeof value ==="object"){
              dataText += joinDataToEmojiText(value,level+2);
              dataText += emojiArray[level+1];
            }else{
              dataText += value.toString()+emojiArray[level+1];
            }
          }
          let emojiL =emojiArray[level+1].length *-1;
          dataText = dataText.slice(0, emojiL);
        }else{
          dataText+=joinDataToEmojiText(data,level+1);
        }

      }else{
        dataText += data[key].toString();
      }
      dataText += emojiArray[level];
    }
    let emojiL =emojiArray[level].length *-1;
     dataText = dataText.slice(0, emojiL);
    return dataText;
}

let data2 = ["ali","veli","mehmet"];
// JavaScript nesnesini JSON string'ine dönüştürme
const jsonString = JSON.stringify(jsObject, null, 2);
const data1 = JSON.parse(jsonString);
// JSON string'ini yazdırma
//console.log(data1.title);
let data3 = 4.0;
console.log("data 1 type",typeof data1);
console.log("data 1 array:",Array.isArray(data1));

console.log("data 2 type",typeof data2);
console.log("data 2 array:",Array.isArray(data2));
console.log("data 3 type",typeof data3);

console.log(Object.keys(data1));
console.log("split",joinDataToEmojiText(data1,0));

