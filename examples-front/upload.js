const input = document.querySelector('input')
const progress = document.querySelector('#progress')
const remaining = document.querySelector('#remaining')
const feedback = document.querySelector('#feedback')

const uploader = (new Uploader())
    .setUploadStatusUrl('http://localhost:9000/uploadStatus')
    .setUploadUrl('http://localhost:9000/upload')
    .setChunkSize(10 ** 3)
    .onProgress(info => {
        progress.innerHTML = info.percent
        remaining.innerHTML = info.remaining
    }, 2000)

document.querySelector('#upload').addEventListener('click', e => {
    const file = input.files[0];

    progress.innerHTML = 0
    progress.innerHTML = 0
    feedback.innerHTML = ''

    uploader
    .setFile(file)
    .upload()
        .then(xhr => {
            feedback.insertAdjacentHTML('beforeend', `<b>success:</b> <pre>${JSON.stringify(xhr.response, null, 2)}</pre>`)
        })
        .catch(e => {
            feedback.insertAdjacentHTML('beforeend', `<b>failed:</b> ${e}`)
        })
})

document.querySelector('#stop').addEventListener('click', () => {
    uploader.abort()
})
