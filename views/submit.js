document.getElementById("submitBtn").addEventListener("click", () => {

    let postid = "canvas"
    let inputElem = document.getElementById('imgfile');
    let file = inputElem.files[0];

    // Create a new file name
    let blob = file.slice(0, file.size, " image/jpeg");
    newFile = new File([blob], `${postid}_post.jpeg`, { type: "image/jpeg" });

    let formData = new FormData();

    formData.append('imgfile', newFile);

    fetch('/upload', {
        method: "POST",
        body: formData,
    })
    .then((res) => res.text())
    .then((x) => console.log(x));
});