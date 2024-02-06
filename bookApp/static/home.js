const myApiKey = "AIzaSyDvwGOI6Fi7m7N3x_VeDaQt60C8iPZeruc"
let endpoint
let data
function validateData(){
    endpoint = `https://www.googleapis.com/books/v1/volumes?q=`
    let isValid = false

    let title = document.getElementById("searchTitle").value.trim()
    if(title !== ""){
        isValid = true
        let tmpTitle = title.split(" ")
        title = ""
        for(let i=0; i<tmpTitle.length; i++){
            if(i !== (tmpTitle.length - 1)) title += "intitle:"+tmpTitle[i]+"+"
            else title += "intitle:"+tmpTitle[i]
        }
        endpoint += title
    }
    let author = document.getElementById("searchAuthor").value.trim()
    if(author !==""){
        isValid = true
        let tmpAuther = author.split(" ")
        author = ""
        for(let i=0; i<tmpAuther.length; i++){
            if(i !== (tmpAuther.length - 1)) author += "inauthor:"+tmpAuther[i]+"+"
            else author += "inauthor:"+tmpAuther[i]
        }
        endpoint += `+${author}`
    }
    let publisher = document.getElementById("searchPublisher").value.trim()
    if(publisher !== ""){
        isValid = true
        let tmpPublisher = publisher.split(" ")
        publisher = ""
        for(let i=0; i<tmpPublisher.length; i++){
            if(i !== (tmpPublisher.length - 1)) publisher += "inpublisher:"+tmpPublisher[i]+"+"
            else publisher += "inpublisher:"+tmpPublisher[i]
        }
        endpoint += `+${publisher}`
    }
    let subject = document.getElementById("searchSubject").value.trim()
    if(subject !== ""){
        isValid = true
        let tmpSubject = subject.split(" ")
        subject = ""
        for(let i=0; i<tmpSubject.length; i++){
            if(i !== (tmpSubject.length - 1)) subject += "subject:"+tmpSubject[i]+"+"
            else subject += "subject:"+tmpSubject[i]
        }
        endpoint += `+${subject}`
    }
    let order = document.getElementById("order").value
    endpoint += `&printType=books&maxResults=30&orderBy=${order}&key=${myApiKey}`

    if(isValid === false) document.getElementById("resultContainer").innerHTML = `<p class="intro">ENTER AT LEAST ONE FIELD</p>`
    else{
        getData()
    }
}

async function getData(){
    try{
        let p = await fetch(endpoint)
        data = await p.json()
        console.log(data)
        showResult()
    }
    catch (err){
        document.getElementById("resultContainer").innerHTML = err.message
    }
}

function showResult(){
    let element = document.getElementById("resultContainer")
    if(data.items === undefined){
        element.innerHTML = `<p class="intro">INVALID SEARCH</p>`
    }
    else{
        element.innerHTML = `
        ${
            function start(){
                let str = ""
                for(let i=0; i<data.items.length; i++){
                    str += `
                    <div class="books">
                    <p><span onclick="showExtraInfo(${i})">${data.items[i].volumeInfo.title}</span></p>
                    <section>${
                        function img(){
                            let sImg = ""
                            if(data.items[i].volumeInfo.imageLinks !== undefined) sImg = `<img src="${data.items[i].volumeInfo.imageLinks.thumbnail}" alt="no image">`
                            else sImg = `Thumbnail not available`
                            return sImg
                        }()
                    }</section>
                    </div>
                    `
                }
                return str
            }()
        }
        `
    }
}

function showExtraInfo(index){
    pElement = document.getElementById("extraInfo")
    pElement.style.display = `flex`
    let grid1 = document.getElementById("grid-1")
    let grid2 = document.getElementById("grid-2")
    let grid3 = document.getElementById("grid-3")

    document.getElementById("eTitle").innerHTML = `${data.items[index].volumeInfo.title}`

    grid1.innerHTML = `
    ${
        function img(){
                            let sImg = ""
                            if(data.items[index].volumeInfo.imageLinks !== undefined) sImg = `<img src="${data.items[index].volumeInfo.imageLinks.thumbnail}" alt="no image">`
                            else sImg = `Thumbnail not available`
                            return sImg
                        }()
    }
    `

    grid2.innerHTML = `
    <p><span>Author Name:</span> ${data.items[index].volumeInfo.authors}</p>
    <p><span>Publisher Name:</span> ${data.items[index].volumeInfo.publisher}</p>
    <p><span>Publish Date:</span> ${data.items[index].volumeInfo.publishedDate}</p>
    <p><span>Language:</span> ${data.items[index].volumeInfo.language}</p>
    <p><span>Genre:</span> ${data.items[index].volumeInfo.categories}</p>
    `

    grid3.innerHTML = `
    <p><span>Description:</span> ${data.items[index].volumeInfo.description}</p>
    <p class="eBuy"><a href="https://www.google.com/">BUY THIS BOOK</a></p>
    `
}

function hideExtraInfo(){
    pElement = document.getElementById("extraInfo")
    pElement.style.display = `none`
}

