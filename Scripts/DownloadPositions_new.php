<?php
/**
 * Created by PhpStorm.
 * User: Emilia
 * Date: 04.11.2017
 * Time: 14:22
 */

//curl  -H  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:57.0) Gecko/20100101 Firefox/57.0' -H  -H
// --compressed -H  -H  -H  -H  -H  --data 'busList%5Bbus%5D%5B%5D=104&busList%5Bbus%5D%5B%5D=105&busList%5Bbus%5D%5B%5D=107&busList%5Bbus%5D%5B%5D=a&busList%5Bbus%5D%5B%5D=c&busList%5Bbus%5D%5B%5D=d&busList%5Bbus%5D%5B%5D=k'

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,'http://mpk.wroc.pl/position.php');
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS,'busList%5Bbus%5D%5B%5D=103');  //Post Fields
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $headers = [
            'X-Apple-Tz: 0',
            'Host: mpk.wroc.pl',
            'Accept: application/json, text/javascript, */*; q=0.01',
            'Accept-Language: pl,en-US;q=0.7,en;q=0.3',
            'Referer: http://mpk.wroc.pl/jak-jezdzimy/mapa-pozycji-pojazdow',
            'Content-Type: application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With: XMLHttpRequest',
            'Cookie: has_js=1',
            'Connection: keep-alive',

        ];

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $server_output = curl_exec ($ch);

        curl_close ($ch);

        print  $server_output ;

