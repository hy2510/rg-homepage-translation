let currentActivity = '';   // 각 Activity에서 세팅됨
let currentLand = 'game';

// root
let effectAlphabet = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/game/effect/";
let letterAlphabet = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/game/letter/";
let letterSound = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/game/sound/";
let letterWord = "https://wcfresource.a1edu.com/newsystem/sound/words/";

//bgm
let sndBgmA1A = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/game/bgm/bgm_gam_a1a.mp3";
let sndBgmA1B = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/game/bgm/bgm_gam_a1b.mp3";
let sndBgmA1C = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/game/bgm/bgm_gam_a1c.mp3";
let sndBgmA1D = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/game/bgm/bgm_gam_a1d.mp3";
let sndBgmA1E = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/game/bgm/bgm_gam_a1e.mp3";
let sndBgmA1F = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/game/bgm/bgm_gam_a1f.mp3";
let sndBgmA1G = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/game/bgm/bgm_gam_a1g.mp3";
let sndBgmA1H = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/game/bgm/bgm_gam_a1h.mp3";
let sndBgmA1I = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/game/bgm/bgm_gam_a1i.mp3";

let sndCorrect = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/game/effect/correct.mp3";     // (07) (800 ~ 1000) 맞췄을 때 나는 소리
let sndIncorrectBoing = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/game/effect/incorrect_boing.mp3"; // (08) (800 ~ 1000) 틀렸을 때 나는 소리 

let sndHammer = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/game/effect/hammer.mp3";
// correct, incorrect FTP에 만들것.
//"https://wcfresource.a1edu.com/newsystem/sound/dodoabc/game/effect/"

// < Alphabet Game 1 > FillTheBasket
let correct_star = effectAlphabet + "correct_star.mp3"		    // 알파벳 게임 정답음
let incorrect_star = effectAlphabet + "incorrect_star.mp3"	    // 알파벳 게임 오답음
let walking = effectAlphabet + "walking.mp3"		            // 도도 걷는 소리

// < Phonics Game 1 > SlingShot
let shooting = effectAlphabet + "shooting.mp3"		            // 대포가 날아가는 소리
let correct_acorn = effectAlphabet + "correct_acorn.mp3"	    // 도토리 정답음
let incorrect_acorn = effectAlphabet + "incorrect_acorn.mp3"	// 도토리 오답음
let correct_ghost = effectAlphabet + "correct_ghost.mp3"	    // 유령 정답음
let incorrect_ghost = effectAlphabet + "incorrect_ghost.mp3"	// 유령 오답음
let correct_sea = effectAlphabet + "correct_sea.mp3"		    // 물방울 정답음
let incorrect_sea = effectAlphabet + "incorrect_sea.mp3"	    // 물방울 오답음

// < Sight Words 1 Game > TapTapTap
let pop_up = effectAlphabet + "pop_up.mp3"			            // 두더지가 튀어 나오는 소리 (MoleSene, MoleSene 2 모두 동일하게 적용)
let pop_down = effectAlphabet + "pop_down.mp3"			        // 두더지가 들어가는 소리 (MoleSene, MoleSene 2 모두 동일하게 적용)
let paper = effectAlphabet + "paper.mp3"			            // 다음 문제로 바뀌는 소리 (MoleSene 2 - 새로운 문제 이미지가 나올 때)
let correct_mole = effectAlphabet + "correct_mole.mp3"		    // MoleSene 정답음
let incorrect_mole = effectAlphabet + "incorrect_mole.mp3"		// MoleSene 오답음
let correct_mole2 = effectAlphabet + "correct_mole2.mp3"		// MoleSene 2 정답음
let incorrect_mole2 = effectAlphabet + "incorrect_mole2.mp3"	// MoleSene 2 오답음

// < Sight Words 2 Game > CarRacing
let engine = effectAlphabet + "engine1.mp3"			            // 자동차 엔진 소리(반복)
let correct_car = effectAlphabet + "car_correct.mp3"		    // CarRacing 정답음
let incorrect_car = effectAlphabet + "car_incorrect.mp3"		// CarRacing 오답음
let move = effectAlphabet + "car_move.mp3"		                // 위 아래 이동
let starting = effectAlphabet + "car_starting.mp3"		        // 자동차 출발
let ending = effectAlphabet + "car_ending.mp3"                  // 꽃가루 날릴때 배경음
let finish = effectAlphabet + "car_finish.mp3"		            // 레이싱 종료시 자동차 소리
let mouseover = effectAlphabet + "car_mouseover.mp3"            // 자동차 고를 때 캐릭터 클릭 효과음
let select = effectAlphabet + "car_select.mp3"                  // 자동차 고를 때 'SELECT' 버튼 효과음
let completed = effectAlphabet + "car_completed.mp3"            // 성공 팝업
let failed = effectAlphabet + "car_failed.mp3"                  // 실패 팝업
let engineBaro = effectAlphabet + "car_engine_baro.mp3"         // 바로 엔진(주행)음
let engineGino= effectAlphabet + "car_engine_gino.mp3"          // 바로 엔진(주행)음
let engineRoro = effectAlphabet + "car_engine_roro.mp3"         // 바로 엔진(주행)음

let sndBgmGino = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/game/bgm/bgm_game_gino.mp3";
let sndBgmRoro = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/game/bgm/bgm_game_roro.mp3";
let sndBgmBaro = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/game/bgm/bgm_game_baro.mp3";
let sndBgmIntro = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/game/bgm/bgm_game_intro.mp3";

const userMode = ssStudyInfo.user

