document.getElementById('testDecodeButton').addEventListener('click', async () => {
    const DELIMITER = String.fromCharCode(30); // Record Separator

    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files.length) {
        alert('Please upload a file first!');
        return;
    }

    const file = fileInput.files[0];
    const resultsDiv = document.getElementById('decodeResults');
    resultsDiv.innerHTML = ''; // Clear previous results

    Papa.parse(file, {
        header: true,
        complete: async (results) => {
            const data = results.data;

            data.forEach(async (row, index) => {
                const baseUrl = row["Base URL"];
                if (!baseUrl || !baseUrl.includes('data=')) {
                    return;
                }

                const encodedPart = baseUrl.split('data=')[1];
                const decodedValue = await decodeData(encodedPart);
                const fields = decodedValue.split(DELIMITER);

                resultsDiv.innerHTML += `
                    <p><strong>Row ${index + 1}:</strong><br>
                    Encoded: ${encodedPart}<br>
                    Decoded (full): ${decodedValue}<br>
                    Fields:<br>
                    - FName: ${fields[0]}<br>
                    - LName: ${fields[1]}<br>
                    - Email: ${fields[2]}<br>
                    - Phone: ${fields[3]}</p>
                    <hr>
                `;
            });
        }
    });
});

async function decodeData(encodedValue) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    
    // Extract length information
    const originalLength = alphabet.indexOf(encodedValue[0]) * 32 + 
                         alphabet.indexOf(encodedValue[1]);
    
    // Convert to bits (skip first two length chars)
    let bits = '';
    for (const char of encodedValue.slice(2)) {
        const index = alphabet.indexOf(char);
        if (index === -1) continue;
        bits += index.toString(2).padStart(5, '0');
    }
    
    // Trim bits to original length
    bits = bits.slice(0, originalLength);
    
    // Convert bits to characters
    let decoded = '';
    for (let i = 0; i < bits.length; i += 8) {
        const byte = bits.slice(i, i + 8);
        if (byte.length < 8) break;
        decoded += String.fromCharCode(parseInt(byte, 2));
    }
    
    return decoded;
}