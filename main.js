const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER'

    const heading = $('header h2')
    const cdThumb = $('.cd-thumb')
    const audio = $('#audio')
    const cd = $('.cd')
    const playBtn = $('.btn-toggle-play')
    const player = $('.player')
    const progress = $('#progress')
    const nextBtn = $('.btn-next')
    const prevBtn = $('.btn-prev')
    const randomBtn = $('.btn-random')
    const repeatBtn = $('.btn-repeat')
    const playlist = $('.playlist')

    const app = {
        currentIndex: 0,
        isPlaying: false,
        isRandom: false,
        isRepeat: false,
        config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
        songs: [

            {
                name: 'Yoru ni Kakeru',
                singer: 'Yoasobi',
                path: './asserts/songs/song1.mp3',
                image: './asserts/musicImg/img_1.jpg'
            },

            {
                name: 'Kaze ni Naru',
                singer: 'Tsuji Ayano',
                path: './asserts/songs/song2.mp3',
                image: './asserts/musicImg/img_2.jpg'
            },

            {
                name: 'Flower Dance',
                singer: 'DJ Okawari',
                path: './asserts/songs/song3.mp3',
                image: './asserts/musicImg/img_3.jpg'
            },

            {
                name: 'Sài Gòn Hôm Nay Mưa',
                singer: 'JSOL, Hoàng Quyên',
                path: './asserts/songs/song4.mp3',
                image: './asserts/musicImg/img_4.jpg'
            },

            {
                name: 'Đoạn Tuyệt Nàng Đi',
                singer: 'Phát Huy T4',
                path: './asserts/songs/song5.mp3',
                image: './asserts/musicImg/img_5.jpg'
            },

            {
                name: 'Thời Không Sai Lệch',
                singer: 'Gumin',
                path: './asserts/songs/song6.mp3',
                image: './asserts/musicImg/img_6.jpg'
            },

            {
                name: 'As You Fade Away',
                singer: 'NEFFEX',
                path: './asserts/songs/song7.mp3',
                image: './asserts/musicImg/img_7.jpg'
            },

        ],

        setConfig: function(key, value) {
                this.config[key] = value;
                localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
            },

        render: function () {
            const htmls = this.songs.map((song, index) => {
                return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                        <div class="thumb" 
                        style="background-image: url('${song.image}')">
                    </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                </div>  
                        `
            });
            playlist.innerHTML = htmls.join('');
        },
        
        defineProperties: function() {
            Object.defineProperty(this, 'currentSong', {
                get: function() {
                    return this.songs[this.currentIndex]
                }
            })
        },
        handleEvents: function() {
            const _this = this 
            const cdWidth = cd.offsetWidth

            // handle CD rotate / stop rotate
            const cdThumbAnimate = cdThumb.animate([
                {transform: 'rotate(360deg)'}
            ], {
                duration: 10000, //10 seconds
                iteration: Infinity
            })

            cdThumbAnimate.pause()

            // Zoom-in / Zoom-out CD
            document.onscroll = function() {
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const newCdWidth = cdWidth - scrollTop

                cd.style.width = cdWidth > 0 ? newCdWidth + 'px' : 0
                cd.style.opacity = newCdWidth / cdWidth

            }

            // handle when click play button
            playBtn.onclick = function() {
                if (_this.isPlaying){

                    audio.pause()

                } else {
                    
                    audio.play()
                    
                }
            }

            // When song played
            audio.onplay = function() {
                _this.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
            }

            // When song paused
            audio.onpause = function() {
                _this.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            }

            // When the song progress change
            audio.ontimeupdate = function() {
                if (audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                    progress.value = progressPercent
                }
            }

            // Handle when changing the song progress
            progress.onchange = function(e) {
                const seekTime = audio.duration / 100 * e.target.value
                audio.currentTime = seekTime
            }

            // When click next song button
            nextBtn.onclick = function() {
                if (_this.isRandom) {
                    _this.playRandomSong()
                } else {
                _this.nextSong()
                }
                audio.play()
                _this.render()
                
            }

            // When click previous song button
            prevBtn.onclick = function() {
                if (_this.isRandom) {
                    _this.playRandomSong()
                } else {
                _this.prevSong()
                }
                audio.play()
                _this.render()
                
            }

            // handle random button turn on / off
            randomBtn.onclick = function() {
                _this.isRandom = !_this.isRandom
                _this.setConfig('isRandom', _this.isRandom)
                randomBtn.classList.toggle('active', _this.isRandom)
            }

            // handle next song when audio ended
            audio.onended = function() {
                if (_this.isRepeat) {
                    audio.play()
                }else{
                    nextBtn.click()
                }
            }

            // handle repeat a song
            repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
                repeatBtn.classList.toggle('active', _this.isRepeat)
        
            }

            // listen click behavior on playlist
            playlist.onclick = function(e) {
                const songNode = e.target.closest('.song:not(.active)')

                if (songNode || e.target.closest('.option')) {
                        // handle when click a song
                        if (songNode) {
                            _this.currentIndex = Number(songNode.dataset.index)
                            _this.loadCurrentSong()
                            audio.play()
                            _this.render()
                        }

                        // handle when click song option

                }
            }
        },

        loadCurrentSong: function() {

            heading.textContent = this.currentSong.name
            cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
            audio.src = this.currentSong.path

        },

        loadConfig: function() {
            this.isRandom = this.config.isRandom
            this.isRepeat = this.config.isRepeat
        },

        nextSong: function() {
            this.currentIndex++
            if (this.currentIndex >= this.songs.length) {
                this.currentIndex = 0
            }
            this.loadCurrentSong()
        },

        prevSong: function() {
            this.currentIndex--
            if (this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1
            }
            this.loadCurrentSong()
        },

        playRandomSong: function() {
            let newIndex
            do {

               newIndex = Math.floor(Math.random() * this.songs.length)
            } while (newIndex === this.currentIndex)
            this.currentIndex = newIndex
            this.loadCurrentSong()
        },
        start: function() {

            // Assign configuration from config to application
            this.loadConfig()
            // Defines properties for Object
            this.defineProperties()

            // Handling events (DOM events)
            this.handleEvents()

            //Render playlist
            this.render()

            // Load the first song information to UI when running the app
            this.loadCurrentSong()

            // Display the initial state of the repeat & random button
            randomBtn.classList.toggle('active', this.isRandom)
            repeatBtn.classList.toggle('active', this.isRepeat)        
    
        }
    }

    app.start();