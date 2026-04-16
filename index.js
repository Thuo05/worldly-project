const dictionaryForm = document.getElementById('dictionaryForm');
const resultsSection = document.getElementById('results');

dictionaryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const word = e.target.querySelector('input').value;
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    resultsSection.innerHTML = '<p>Searching...</p>';

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Word not found');
            return response.json();
        })
        .then(data => {
            const wordData = data[0];
            
            const phoneticText = wordData.phonetic || (wordData.phonetics.find(p => p.text)?.text) || "";

            
            const origin = wordData.origin || "";

            let audioSrc = wordData.phonetics.find(p => p.audio && p.audio !== "")?.audio;
            if (audioSrc && audioSrc.startsWith('//')) {
                audioSrc = 'https:' + audioSrc;
            }

            resultsSection.innerHTML = `
                <div class="result-card">
                    <div class="result-header">
                        <div>
                            <h2>${wordData.word}</h2>
                            <p class="phonetic">${phoneticText}</p>
                        </div>
                        ${audioSrc ? `<button class="audio-btn" onclick="new Audio('${audioSrc}').play()">Play Audio</button>` : ''}
                    </div>

                    ${origin ? `<div class="origin-section"><strong>Origin:</strong> ${origin}</div>` : ''}

                    <div class="meanings-container">
                        ${wordData.meanings.map(m => `
                            <div class="meaning-block">
                                <span class="part-of-speech">${m.partOfSpeech}</span>
                                <p class="definition">${m.definitions[0].definition}</p>
                                ${m.definitions[0].example ? `<p class="example">"${m.definitions[0].example}"</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        })
        .catch(err => {
            resultsSection.innerHTML = `<p class="error">${err.message}</p>`;
        });
});