var data = { count: 0 }

window.onload = function() {    
    var output = document.getElementById("output")

    console.log(document.cookie)
    data.count = JSON.parse(document.cookie).count

    output.innerHTML = data.count
}

function increment() {
    data.count += 1
    
    output.innerHTML = data.count
    document.cookie = ""
    document.cookie = JSON.stringify(data)
}

function reset() {
    data.count = 0

    output.innerHTML = data.count
    document.cookie = ""
    document.cookie = JSON.stringify(data)
}