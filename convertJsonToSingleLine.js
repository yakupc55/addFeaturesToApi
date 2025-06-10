const fs = require('fs');

// JSON dosyasını okuma ve işleme fonksiyonu
function convertJsonToSingleLine(jsonFilePath, outputTxtFilePath) {
    try {
        // JSON dosyasını oku
        const jsonData = fs.readFileSync(jsonFilePath, 'utf8');

        // JSON içeriğini tek satırlı hale getir
        const singleLineContent = JSON.stringify(JSON.parse(jsonData))
            //.replace(/'/g, "\\'") // Tek tırnakları escape et
            .replace(/"/g, '\\"'); // Çift tırnakları escape et

        // Tek satırlı içeriği txt dosyasına yaz
        fs.writeFileSync(outputTxtFilePath, singleLineContent, 'utf8');
        console.log(`İçerik başarıyla ${outputTxtFilePath} dosyasına kaydedildi.`);
    } catch (error) {
        console.error('Hata oluştu:', error.message);
    }
}

// Örnek kullanım
const jsonFilePath = 'dataset.json'; // JSON dosyasının yolu
const outputTxtFilePath = 'output.txt'; // Çıktı txt dosyasının yolu

convertJsonToSingleLine(jsonFilePath, outputTxtFilePath);