new Vue({
    el: '#frontend',
        data() {
            return {
            css: {
                title:"CSS",
                frameworks: [
                    {'title':"Bootstrap","link":"https://getbootstrap.com/"},
                    {'title':"Materialize","link":"https://materializecss.com/"},
                    {'title':"Material Design Lite(MDL)","link":"https://getmdl.io/"},
                    {'title':"Bulma","link":"https://bulma.io/"}
                ]},
            js:{
                title:"Javascript",
                frameworks: [
                    {title: "Vuejs", link:"https://vuejs.org/"},
                    {title: "Jquery", link:"https://jquery.com/"},
                    {title: "knockout", link:"https://knockoutjs.com/"},
                    {title: "lodash", link:"https://lodash.com/"},
                    {title: "moonjs", link:"https://kbrsh.github.io/moon/"},
                    {title: "requirejs", link:"https://requirejs.org/"},
                    {title: "node", link:"https://nodejs.org/en/"}
                ]
            }
        }
    }
  });
  /**

   */
new Vue({
    el: '#backend',
        data() {
            return {
                items: {
                    "Python/Django": "Подръжка на информационен сайт",
                    "PHP5.3+ /7+": "Доста разнородни проекти, от такива с малко натовравния до такива над 1000 заявки в секунда",
                    "Symfony 2.4/3.4/4.4": "Доста богат опит, от cli-tools до системи за управление на процесите в производстовото",
                    "Zend": "Подръжка на няколко много стари проекта със първите версии",
                    "CI2": "Няколко лични проекта, и няколко за поддръжка",
                    "Yii/Yii2": "Два три лични проекта",
                    "Phalcon": "Няколко акедемични задачки",
                    "Magento2": "Доста сериозни магазини, със много промени по основните фунционалности като (поръчки, потребители, каталог и т.н)",
                    "Joomla JSocial": "Мигриране на 1.3 към 4 и писане на късъм логика",
                    "WP, Drupal": "Имам някаква представа какво преставляват",
                    "Sylius": "Два от поректите който съм правил с M2, реших да ги направя с Sylius, като домашна работа",
                    "Python /Django": "Начлно ниво, общо взето съм вдигал блог като съм включвал Angular 1",
                    "DataBase": " MySql/MariaDB/SQLITE2 - от много малки бази до огромни дата сетове",
                    "SQL": "има ли смисъл да го споменавам ?",
                    "Ajax": "колкото и да не ми харесва js все пак тенденциите са в SPA и XHR",
                    "REST": "много ми се иска да работя по тези парадигми но рядко се случва.",
                    "SOAP": "необходимо зло",
                    "PHP frameworks": "SF 2/3/4, CI2, Zend 1/2, Yii/Yii2, Phalcon",
                    "node": "Използвам го при проектите с по-сложен Frontend. "
                }
        }
    }
  });
