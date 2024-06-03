for file in *.png; do
    # 파일명에서 5번째 글자 추출
    fifth_char="${file:4:1}"
    
    # 5번째 글자를 대문자로 변환
    fifth_char_upper=$(echo "$fifth_char" | tr '[:lower:]' '[:upper:]')
    
    # 새로운 파일명 생성
    new_file="${file:0:4}${fifth_char_upper}${file:5}"
    
    # 새로운 파일명 출력
    echo "$file  =>  $new_file"

    cp $file newFile/$new_file
done
