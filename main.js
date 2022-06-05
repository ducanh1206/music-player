const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll(document);

const app = {
    render: function() {
        console.log(123)
    }
    songs: [
        {
            name: YoruniKakeru,
            singer: Yoasobi,
            path: './asserts/music/song1.mp3',
            images: './asserts/musicImg/img_1'
        },

        {
            name: KazeniNaru,
            singer: TsujiAyano,
            path: './asserts/music/song2.mp3',
            images: './asserts/musicImg/img_2'
        },

    ],
    start: function() {
        this.render
    }
}

app.start()