라이센스가 바뀌면 

다음을 모두 교체해줘야함
./lib/*
./STT_EDU_ENG_DB/*
음원으로 만든 dat 파일 


※ 인식 레벨
0: Reference Data, 1:Beginner, 2: Intermediate, 3: Advanced, 4: Expert

※ 인식 모델
North American English: 0(Male), 1(Female), 2(Child), 3(All voice)
Korean English: 4(Male), 5(Female), 6(Child), 7(All voice)

※
initSelvas() 함수 내의 initAudio(xxx);  <== initAutio 함수의 파라미터인 xxx 함수에서 오류가 발생하면
셀바스 초기화 오류 메시지('Error getting audio', "This page does not use EPD Module") 출력됨
(xxx는 셀바스 함수 아님), 개발시 유의할것