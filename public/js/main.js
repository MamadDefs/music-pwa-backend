/*=============== PAGE && Music Player Contents ===============*/

const musicPlayerContent=`
<div class="music-player">
    <div class="maximize-btn">︿</div>
    <div class="minimize-btn">﹀</div>
    <img id="tumbnail" src="/img/Mehrdad - Masale.jpg" alt="">
    <h1 id="song-name">بزن باران</h1>
    <h1 id="song-singer">کامران هومن</h1>
    <audio id="music-player-audio" src="https://dls.music-fa.com/tagdl/downloads/Ehaam%20-%20Bezan%20Baran%20(128).mp3" controls="controls"></audio>
</div>
`;

const homePageContent=`
<h2 class="music-section-title">موزیک های ویژه</h2>
    <div class="music-section">
        <div class="post">
            <img src="img/alf_labod.jpg" alt="" class="song-image">
            <h3 class="song-name">Labod</h3>
            <h4 class="artist-name">Alf</h4>
        </div>
        <div class="post">
            <img src="img/walton_nabin-768x768.jpg" alt="" class="song-image">
            <h3 class="song-name">Nabin</h3>
            <h4 class="artist-name">WALTON</h4>
        </div>
        <div class="post">
            <img src="img/alf_gher_bede.jpg" alt="" class="song-image">
            <h3 class="song-name">GHER BEDE</h3>
            <h4 class="artist-name">Alf</h4>
        </div>
        <div class="post">
            <img src="img/aatkaa_nemikham_darsamo bekhoonam.jpg" alt="" class="song-image">
            <h3 class="song-name">Nemikham darsamo bekhonam</h3>
            <h4 class="artist-name">AATKAA</h4>
        </div>
        <div class="post">
            <img src="img/Mehrdad - Masale.jpg" alt="" class="song-image">
            <h3 class="song-name">Mesale</h3>
            <h4 class="artist-name">Mehrad</h4>
        </div>
        <div class="post">
            <img src="img/Mehrdad - Masale.jpg" alt="" class="song-image">
            <h3 class="song-name">Mesale</h3>
            <h4 class="artist-name">Mehrad</h4>
        </div>
    </div>
    <div class="line"></div>
    
    <h2 class="music-section-title">تازه ترین موسیقی ها</h2>
    <div class="music-section">
        <div class="post">
            <img src="img/alf_labod.jpg" alt="" class="song-image">
            <h3 class="song-name">Labod</h3>
            <h4 class="artist-name">Alf</h4>
        </div>
        <div class="post">
            <img src="img/walton_nabin-768x768.jpg" alt="" class="song-image">
            <h3 class="song-name">Nabin</h3>
            <h4 class="artist-name">WALTON</h4>
        </div>
        <div class="post">
            <img src="img/alf_gher_bede.jpg" alt="" class="song-image">
            <h3 class="song-name">GHER BEDE</h3>
            <h4 class="artist-name">Alf</h4>
        </div>
        <div class="post">
            <img src="img/aatkaa_nemikham_darsamo bekhoonam.jpg" alt="" class="song-image">
            <h3 class="song-name">Nemikham darsamo bekhonam</h3>
            <h4 class="artist-name">AATKAA</h4>
        </div>
        <div class="post">
            <img src="img/Mehrdad - Masale.jpg" alt="" class="song-image">
            <h3 class="song-name">Mesale</h3>
            <h4 class="artist-name">Mehrad</h4>
        </div>
        <div class="post">
            <img src="img/Mehrdad - Masale.jpg" alt="" class="song-image">
            <h3 class="song-name">Mesale</h3>
            <h4 class="artist-name">Mehrad</h4>
        </div>
    </div>
    
`;


/*=============== PAGE && Music Player BEHAVIOR ===============*/
let pageContentHolder=document.getElementById('page-content-holder');
let musicPlayerHolder=document.getElementById('music-player-holder');
let home_btn=document.getElementById('home-btn');
let search_btn=document.getElementById('search-btn');
let playlist_btn=document.getElementById('playlist-btn');
let profile_btn=document.getElementById('profile-btn');



if(home_btn && search_btn && playlist_btn && profile_btn && pageContentHolder && musicPlayerHolder){

    musicPlayerHolder.innerHTML=musicPlayerContent;

    home_btn.onclick=function(){
        pageContentHolder.innerHTML=homePageContent;
    }

    search_btn.onclick=function(){
        pageContentHolder.innerHTML="search";
    }

    playlist_btn.onclick=function(){
        pageContentHolder.innerHTML="playlist";
    }

}






/*=============== LOGIN AND SIGN UP FORM CHANGE ===============*/
var login_form="<form action='/users/login' method='post'><input type='text' placeholder='نام کاربری' name='username'><input type='password' placeholder='رمز عبور' name='password'><button type='submit' name='submit' value='submit'>ورود</button></form>";
var signup_form="<form action='/users/register' method='post'><input type='text' placeholder='نام کاربری' name='username'><input type='email' placeholder='ایمیل' name='email'><input type='password' placeholder='رمز عبور' name='password'><input type='password' placeholder='تکرار رمز عبور' name='passwordCconfirm'><button type='submit' name='submit' value='submit'>ثبت نام</button></form>";

var login_btn=document.querySelector('.login-btn');
var signup_btn=document.querySelector('.signup-btn');
var form_holder=document.querySelector('.form-holder');

if(login_btn && signup_btn){

    login_btn.onclick=function(){
    form_holder.innerHTML=login_form;
    login_btn.style="border-bottom: solid rgba(0, 0, 0, 0.8);";
    signup_btn.style="border-bottom: solid rgba(0, 0, 0, 0.2);";
    }

    signup_btn.onclick=function(){
        form_holder.innerHTML=signup_form;
        login_btn.style="border-bottom: solid rgba(0, 0, 0, 0.2);";
        signup_btn.style="border-bottom: solid rgba(0, 0, 0, 0.8);";
    }

}











/*=============== MUSIC PLAYER MAXIMIZE AND MINIZE ===============*/

var music_player=document.querySelector('.music-player');
var maximize_btn=document.querySelector('.maximize-btn');
var minimize_btn=document.querySelector('.minimize-btn');
var tumbnail=document.querySelector('#tumbnail');
var music_player_audio=document.querySelector('#music-player-audio');
var song_name=document.querySelector('#song-name');
var song_singer=document.querySelector('#song-singer');

if(maximize_btn && minimize_btn && music_player){
    maximize_btn.onclick=function(){
        music_player.style='animation-name:maximize; ';
        maximize_btn.style='display: none;';
        minimize_btn.style="display:inline;";
        tumbnail.style='animation-name:maximize-tumbnail;';
        music_player_audio.style='animation-name:maximize-audio;';
        song_name.style='display:block;';
        song_singer.style='display:block;';
    }
    minimize_btn.onclick=function(){
        music_player.style='animation-name:minimize; ';
        maximize_btn.style='display: inline;';
        minimize_btn.style="display:none;";
        tumbnail.style='animation-name:minimize-tumbnail;';
        music_player_audio.style='animation-name:minimize-audio;';
        song_name.style='display:none;';
        song_singer.style='display:none;';
    }
}
