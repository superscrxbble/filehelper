document.getElementById('fileInput').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        uploadFile(file);
    }
});

function uploadFile(file) {
    const formData = new FormData();
    const domain = document.getElementById('domainselecter').value;
    formData.append('file', file);

    document.getElementById('progressContainer').style.display = 'block';

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/upload?domain=${domain}`, true);

    xhr.upload.addEventListener('progress', function(e) {
        if (e.lengthComputable) {
            const percent = (e.loaded / e.total) * 100;
            document.getElementById('progressBar').style.width = percent + '%';
            document.getElementById('progressBar').textContent = Math.round(percent) + '%';
        }
    });

    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.fileUrl) {
                document.getElementById('result').style.display = 'block';
                document.getElementById('fileUrl').href = response.fileUrl;
                document.getElementById('fileUrl').textContent = response.fileUrl;
                document.getElementById('copy').onclick = () =>
                    navigator.clipboard.writeText(response.fileUrl)
                    .then(() => alert("copied!! :3"))
                    .catch(err => alert("error: " + err));
            }
        } else {
            alert('upload error: ' + xhr.statusText);
        }
    };

    xhr.onerror = () => alert('error uploading file');
    xhr.send(formData);
}
