package main

import (
    "log"
    "flag"
    "net/http"
)

func main() {
    port := flag.String("port", "1234", "Port to serve on")
    flag.Parse()

    fs := http.FileServer(http.Dir("./public"))
    http.Handle("/", fs)

    log.Println("Listening on port " + *port)
    http.ListenAndServe(":" + *port, nil)
}
