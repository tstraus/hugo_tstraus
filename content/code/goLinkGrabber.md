+++
Categories = []
Description = ""
Tags = []
date = "2016-05-21T08:41:33-04:00"
title = "HTML Link Grabber (GoLang)"

+++

<link href="../../css/prism.css" rel="stylesheet"/>
<script src="../../scripts/prism.js"></script>

This program takes in a web address as a command line argument. Then goes and gets that page and then prints out all of the links to other pages. While not all that useful, it was a good first step into web programming.

Credit for this goes to Jack Canty's website because I've never written anything like this. His can be found [here](https://jdanger.com/build-a-web-crawler-in-go.html).

~~~go
package main
import (
    "fmt"
    "flag"
    "net/http"
    "os"
    "io"
    "golang.org/x/net/html"
)

func main() {
    flag.Parse()
    arg := flag.Args()
    fmt.Println(arg)

    if len(arg) == 0 {
        fmt.Printf("Enter a page\nex. \"http://google.com\"")
        os.Exit(1)
    }

    data, error := http.Get(arg[0])   
    if error != nil {
        return
    }
    defer data.Body.Close()
    links := collectLinks(data.Body)

    for _, link := range(links) {
        fmt.Printf("\t")
        fmt.Println(link)
    }
}

func collectLinks(httpBody io.Reader) []string {
    links := make([]string, 0)
    page := html.NewTokenizer(httpBody)
    for {
        tokenType := page.Next()
        if tokenType == html.ErrorToken {
            return links
        }
        token := page.Token()
        if tokenType == html.StartTagToken && token.DataAtom.String() == "a" {
            for _, attr := range token.Attr {
                if attr.Key == "href" {
                    links = append(links, attr.Val)
                }
            }
        }
    }
}
~~~