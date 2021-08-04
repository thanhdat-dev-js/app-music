const songs = [
    {
        name: "Sai cách yêu",
        singer: "Lê Bảo Bình",
        path: "https://thanhdat4421.github.io/app-music/assets/song/3990206034272827168.mp3",
        image: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/5/1/7/c/517ca58e0bb720d2e469e96259ef2bdd.jpg"
    },
    {
        name: "Bỏ em vào ba lô",
        singer: "Tân Trần x Freak D",
        path: "https://thanhdat4421.github.io/app-music/assets/song/8878561538087086642.mp3",
        image: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/9/2/d/1/92d1087e7b366b4cf7d1539d37e5f610.jpg"
    },
    {
        name: "Haru Haru",
        singer: "Big Bang",
        path: "https://thanhdat4421.github.io/app-music/assets/song/8012948398759953196.mp3",
        image: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/covers/e/8/e83bc89e7fed15678fab7e749509c3c3_1289491851.jpg"
    },
    {
        name: "Chiều thu họa bóng nàng",
        singer: "Ca sĩ bí ẩn",
        path: "https://thanhdat4421.github.io/app-music/assets/song/7049726035475036059.mp3",
        image: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/c/0/4/7/c047c4e29dbeda34deacbe2d8dbb71dc.jpg"
    },
    {
        name: "Giá như cô ấy chưa xuất hiện",
        singer: "Miu Lê",
        path: "https://thanhdat4421.github.io/app-music/assets/song/3068542574464060159.mp3",
        image: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/0/d/5/f/0d5fd64189282d2411ca939024f7047e.jpg"
    },
    {
        name: "Anh ta bỏ em rồi",
        singer: "Hương Giang",
        path: "https://github.com/thanhdat4421/app-music/assets/song/1501864544223667902.mp3",
        image: " https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/d/3/4/b/d34b167ca36dcb3ee02f1a902ea57c57.jpg"
    }
]
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const app = $('.app')
const currentName = $('.dashboard h2');
const audio = $('#audio');
const btn_toggle_play = $('.btn.btn-play');
const progress = $('.progress');
const btn_next = $('.btn-next');
const btn_prev = $('.btn-prev');
const btn_random = $('.btn-random');
const btn_repeat = $('.btn-repeat');
const playlist = $('.playlist');
const cd = $('.cd');
const cd_thumb = $('.cd-thumb');
const MUSIC_APP_LOCAL = "tieupham";
//declare const variable




/* 
    1. render song
    2. Scroll TOp
    3. Play/ Pause/ Seek
    4. CD rotate
    5. Next Prev
    6. Repeat Random
    7. Play when App ended
    8. Click Playlist
 */
class App {
    constructor() {
        this.start();
    }
    start() {
        this.defineProperty();
        this.renderSong();
        this.handleEvent();
        this.loadCurrentSong();
    }
    defineProperty() {
        this.offsetW = cd.offsetWidth;
        this.isPlaying = false;
        this.currentIdx = 0;
        this.config = JSON.parse(localStorage.getItem(MUSIC_APP_LOCAL)) || {};
        this.isRandom = this.config.isRandom || false;
        this.isRepeat = this.config.isRepeat || false;
        if (this.isRandom) {
            btn_random.classList.add('active-control');
        }
        if (this.isRepeat) {
            btn_repeat.classList.add('active-control');
        }
        this.queue = [];
        for (let i = 0; i < songs.length; i++) {
            this.queue.push(i);
        }
    };
    handleEvent() {
        document.onscroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            cd.style.width = scrollTop < this.offsetW ? this.offsetW - scrollTop + 'px' : 0;
        }
        const animation = cd.animate([{
            transform: 'rotate(360deg)'
        }], {
            duration: 20000,
            iterations: Infinity
        })
        animation.pause();
        btn_toggle_play.onclick = (e) => {
            if (this.isPlaying) {
                app.classList.remove('playing');
                animation.pause();
                this.isPlaying = false;
                audio.pause();
            }
            else {
                app.classList.add('playing');
                animation.play();
                this.isPlaying = true;
                audio.play();
            }
        }
        btn_next.onclick = () => {
            this.nextSong();
        }
        btn_prev.onclick = () => {
            this.prevSong();
        }
        btn_repeat.onclick = () => {
            this.isRepeat = this.isRepeat ? false : true;
            this.setConfig("isRepeat", this.isRepeat)
            btn_repeat.classList.toggle('active-control');
        }
        btn_random.onclick = () => {
            this.isRandom = this.isRandom ? false : true;
            this.setConfig("isRandom", this.isRandom);
            btn_random.classList.toggle('active-control');
        }
        progress.onchange = () => {
            audio.currentTime = progress.value / 10000 * audio.duration;
            this.updateProgress();
            audio.play();
            app.classList.add('playing');
        }
        audio.onended = () => {
            this.nextSong();
        }

        playlist.onclick = (e) => {
            this.currentIdx = e.target.closest('.song').getAttribute('data-index');
            this.loadCurrentSong();
            progress.value = 0;
            audio.play();
            animation.play();
        }
        setInterval(this.updateProgress(), 2000);
    }
    renderSong() {
        const htmls = songs.map((song, idx) => {
            return `
        <div class="song" data-index="${idx}">
            <div class="cd-thumb" style="background-image: url(${song.image})"></div>
            <div class="body">
                <h3>${song.name}</h3>
                <p>${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
        `
        })
        $('.playlist').innerHTML = htmls.join('');
    }
    nextSong() {
        if (this.isRepeat) {

        }
        else if (this.isRandom) {
            let idx = Math.floor(Math.random() * this.queue.length);
            this.currentIdx = this.queue[idx];
            this.queue.splice(idx, 1);
            if (!this.queue.length) {
                for (let i = 0; i < songs.length; i++) {
                    this.queue.push(i);
                }
            }
        }
        else {
            this.currentIdx = this.currentIdx == songs.length - 1 ? 0 : ++this.currentIdx;
        }
        this.loadCurrentSong();
        progress.value = 0;
        audio.play();
        app.classList.add('playing');

    }
    prevSong() {
        if (this.isRepeat) {

        }
        else if (this.isRandom) {
            let idx = Math.floor(Math.random() * this.queue.length);
            this.currentIdx = this.queue[idx];
            this.queue.splice(idx, 1);
            if (!this.queue.length) {
                for (let i = 0; i < songs.length; i++) {
                    this.queue.push(i);
                }
            }
        }
        else {
            this.currentIdx = this.currentIdx == 0 ? songs.length - 1 : --this.currentIdx;
        }
        this.loadCurrentSong();
        progress.value = 0;
        audio.play();
        app.classList.add('playing');

    }
    loadCurrentSong() {
        cd_thumb.style.backgroundImage = `url(${this.getCurrentSong().image})`;
        currentName.innerText = `${this.getCurrentSong().name}`;
        audio.src = `${this.getCurrentSong().path}`;
        const songList = $$('.song');
        for (let song of songList) {
            if (song.classList.contains('active-bg'))
                song.classList.remove('active-bg');
        }
        const songCurrent = $(`[data-index="${this.currentIdx}"`);
        songCurrent.classList.add('active-bg');
    }
    getCurrentSong() {
        return songs[this.currentIdx];
    }
    updateProgress() {
        if (audio.duration) {
            const currentTime = audio.currentTime / audio.duration * 10000;
            progress.value = currentTime;
        }
    }
    setConfig(key, value) {
        this.config[key] = value;
        localStorage.setItem(MUSIC_APP_LOCAL, JSON.stringify(this.config));
    }
}
new App();
