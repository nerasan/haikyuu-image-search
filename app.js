// declaring the variables for request url and subreddit 
const requestUrl = "https://www.reddit.com/search.json?q="
const subreddit = "+subreddit:haikyuu+nsfw:no"
let counter = -1

// AJAX function
const fetchPlayer = (keyword) => {
    fetch(requestUrl+keyword+subreddit)
    .then((responseData)=>{
        return responseData.json()
    })
    .then((jsonData)=>{
        // DECLARING ALL FUNCTIONS
        const addLayout = () => {
            let title = document.createElement("h1")
            title.innerHTML = "nice search!"
            container.appendChild(title)
        }
        // add image 
        const addImage = (redditpic) => {
            let imageBox = document.createElement("div")
            imageBox.setAttribute("id", "imageBox")
            container.appendChild(imageBox)
            let image = document.createElement("img")
            image.setAttribute("src", redditpic)
            imageBox.appendChild(image)
        }
        // add reddit link -- NOT USED AT THE MOMENT SINCE I HAD TO CHANGE CODE FOR RESET BUTTON/CLEAR INTERVAL. might revisit later!
        // const addRedditLink = (redditlink) => {
        //     let source = document.createElement("div")
        //     source.setAttribute("id", "source")
        //     container.appendChild(source)
        //     let link = document.createElement("a")
        //     link.setAttribute("href", redditlink)
        //     link.setAttribute("target", "_blank")
        //     source.appendChild(link)
        //     link.innerText = "see full post"
        // }
        // add reset button
        const addResetButton = () => {
            let resetButton = document.createElement("button")
            resetButton.setAttribute("id", "reset")
            resetButton.innerText = "search another player"
            container.appendChild(resetButton)
            resetButton.addEventListener("click", backToSearch)
        }
        // clear page 
        const clear = () => { 
            const container = document.getElementById("container")
            while (container.firstChild) {
                container.removeChild(container.lastChild)
            }
        }
        // clears page to default search page
        const backToSearch = () => {
            clearInterval(interval)
            clear()
            addOriginalElements()
        }
        // functions to create all original elements in default search page -- THIS ENDED UP REALLY LONG BECAUSE I HAD TOO MANY THINGS AT THE START PAGE
        const addOriginalElements = () => {
            let h1 = document.createElement("h1")
            h1.innerText = "search a word, get haikyuu-related pictures"
            container.appendChild(h1)
            let imageBox = document.createElement("div")
            imageBox.setAttribute("id", "imageBox")
            container.appendChild(imageBox)
            let defaultpic = document.createElement("img")
            defaultpic.setAttribute("src", "./images/karasuno-team.png")
            defaultpic.setAttribute("id", "defaultpic")
            imageBox.appendChild(defaultpic)
            let form = document.createElement("form")
            form.setAttribute("id", "form")
            container.appendChild(form)
            let input = document.createElement("input")
            input.setAttribute("id", "input")
            input.setAttribute("spellcheck", "false")
            form.appendChild(input)
            let submit = document.createElement("input")
            submit.setAttribute("type", "submit")
            submit.setAttribute("value", "let's go!")
            form.append(submit)
            form.addEventListener('submit', (event)=>{
                event.preventDefault()
                fetchPlayer(input.value)
            })
            let text = document.createElement("div")
            text.setAttribute("id", "text")
            container.appendChild(text)
            let p = document.createElement("p")
            p.setAttribute("id", "risk")
            p.innerText = "spoilers at your own risk"
            text.appendChild(p)
        }

        let children = jsonData.data.children // this is the array of children
        //console.log("array of children:", children) // console logging the children array
        
        // unfiltered images
        let images = children.map((child)=>{
            return child.data.url
        })
        //console.log("unfiltered images:", images) // console logging the images array
        
        // unfiltered permalinks
        let permalinks = children.map((child)=>{
            return child.data.permalink
        })
        //console.log("array of unfiltered links:", permalinks) // console logging the permalinks
        
        // discussed this one with camille since we were stuck on filtering!! she gets the creds here :)
        const filterPics = (str) => {
            if(str.includes(".jpg")) {
                return true 
            } else {
                return false 
            }
        }
        
        // create array of images filtered to only return if it has jpg
        let jpgs = images.filter(filterPics)
        // slideshow function that runs every 5 seconds
        const slideshow = () => {
            ++counter
            if (counter >= jpgs.length) {
                counter = 0
            }
            clear()
            addLayout()
            addImage(jpgs[counter])
            addResetButton()
            //let redditlink = "https://www.reddit.com" + permalinks[counter]
            //addRedditLink(redditlink)
        }
        const interval = setInterval(slideshow, 5000)
        clear()
        slideshow()
    })
    .catch((err)=>{
        console.log("time out! check this error: ", err)
    })
}

document.addEventListener('DOMContentLoaded', ()=>{
    form.addEventListener('submit', (event)=>{
        event.preventDefault()
        fetchPlayer(input.value)
        console.log(input.value + "? nice search!")
    })
})