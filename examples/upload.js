const input = document.querySelector('input')
const progress = document.querySelector('#progress')
const remaining = document.querySelector('#remaining')

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

    uploader
    .setFile(file)
    .upload()
        .then(xhr => {
            console.log('success', xhr.response)
        })
        .catch(e => {
            console.log('error', e)
        })
})

document.querySelector('#stop').addEventListener('click', () => {
    uploader.abort()
})
