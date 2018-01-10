var $profil_menu = $('#profil-menu');
var $mur_menu = $('#mur-menu');

var $form_add_article = $('#add-article');
var $author_name, $author_firstname, $article_title, $article_content;
var fcts_check = {};
var article_inputs = {
    author_name_txt : '',
    author_firstname_txt : '',
    article_title_txt : '',
    article_content_txt : ''
}
var $articles = $('#articles');

var $form_manage_profil = $('#manage-profil');
var $p_author_name, $p_author_firstname, $p_author_address, $p_author_birthdate, $p_author_tel, $p_author_mail;
var fcts_check_profil = {};
var profil_inputs = {
    author_name_txt : '',
    author_firstname_txt : '',
    author_address_txt : '',
    author_birthdate_txt : '',
    author_tel_txt : '',
    author_mail_txt : ''
}


function AddArticle() {
    var elements = 
        "<div class='div-article'>" +
            "<span class='author-article'>" + article_inputs.author_firstname_txt + " " +  article_inputs.author_name_txt  + "</span>" + " le " +
            "<span class='date-article'>" + new Date().toLocaleDateString('fr') + "</span><br>" +
            "<h4>" + article_inputs.article_title_txt + "</h4>" +
            "<p>" + article_inputs.article_content_txt + "</p>" +
        "</div>";

    var $elements = $(elements);
    $articles.append($elements);
}

function GetArticles() {
    if (localStorage.nbArticles) {
        for (var i = 0, retrieved_article; i < localStorage.nbArticles; i++) {
             retrieved_article = localStorage.getItem("article" + i);
             article_inputs = JSON.parse(retrieved_article);
             AddArticle();
        }
    } else {
        localStorage.nbArticles = 0; 
    }
}

function InitPages() {
    $form_add_article.addClass('hidden');
    $articles.addClass('hidden');
    $form_manage_profil.addClass('hidden');
    GetArticles();
}
InitPages();

function PutMsgInfo(form_name, msg) {
    var $msg = $('#' + form_name+ ' .validation .msg-info');
    $msg.text(msg);
}

function MsgInfoProfil(put_msg) {
    var msg = '';
    if (put_msg) {
        if (localStorage.user_profil) {
            msg = "Mise à jour du profil OK !"
        } else {
            msg = "Enregistrement du profil OK !";
        }
    }
    PutMsgInfo('manage-profil', msg);
}

function MsgInfoAddArticle(put_msg, title_article) {
    var msg = '';
    if (put_msg) {
        msg = "Ajout de l'article '" + title_article.substring(0,15) + "' OK !";
    }
    PutMsgInfo('add-article', msg);
}

function CleanError(form_name) {
    var $errors = $('#' + form_name + ' .error');
    $errors.each(function() {
        $(this).text('');
    }); 
}

function GetProfilName() {
    if (localStorage.user_profil) {
        var retrieved_profil = localStorage.getItem("user_profil");
        profil_inputs = JSON.parse(retrieved_profil);
        var $name = $('#add-article #author-name');
        $name.val(profil_inputs.author_name_txt);

        var $firstname = $('#add-article #author-firstname');
        $firstname.val(profil_inputs.author_firstname_txt);
    }
}

$mur_menu.click(function() {
    $form_manage_profil.addClass('hidden');
    $form_add_article.removeClass('hidden');
    $articles.removeClass('hidden');  
    CleanError('add-article');
    MsgInfoAddArticle(false, '');
    GetProfilName();
});

function FillFormProfil() {
    if (localStorage.user_profil) {
        var retrieved_profil = localStorage.getItem("user_profil");
        profil_inputs = JSON.parse(retrieved_profil);
        var $inputs = $('#manage-profil input, #manage-profil textarea').not(':submit');
        var id;
        $inputs.each(function() {
            id = $(this).attr('id');
            switch (id) {
                case 'p-author-name':
                    $(this).val(profil_inputs.author_name_txt);
                    $p_author_name = $(this);
                break;

                case 'p-author-firstname':
                    $(this).val(profil_inputs.author_firstname_txt);
                    $p_author_firstname = $(this);
                break;

                case 'p-author-address':
                    $(this).val(profil_inputs.author_address_txt); 
                    $p_author_address = $(this); 
                break; 

                case 'p-author-birthdate':
                    $(this).val(profil_inputs.author_birthdate_txt);
                    $p_author_birthdate = $(this);   
                break;

                case 'p-author-tel':
                    $(this).val(profil_inputs.author_tel_txt);
                    $p_author_tel = $(this);
                break;

                case 'p-author-mail':
                    $(this).val(profil_inputs.author_mail_txt);
                    $p_author_mail = $(this);
                break;

                default:
            }
        })
    }
}

$profil_menu.click(function() {
    $form_manage_profil.removeClass('hidden');
    $form_add_article.addClass('hidden');
    $articles.addClass('hidden');
    CleanError('manage-profil');
    MsgInfoProfil(false);
    FillFormProfil();
})

function PutError(id, msg) {
    var $error_name = $('#' + id + '+.error');
    $error_name.text(msg);
}

function CheckAuthorName($input, id) {
    var ok = true;
    if ($input.val().length < 2) {
        PutError(id, 'Pas assez de caractères pour le nom !');
        ok = false;
    }

    return ok;
}

fcts_check['author-name'] = function($input) {
    $author_name = $input;
    article_inputs.author_name_txt = $author_name.val();
    return CheckAuthorName($input, 'author-name');
}

function CheckAuthorFirstname($input, id) {
    var ok = true;
    if ($input.val().length < 2) {
        PutError(id, 'Pas assez de caractères pour le prénom !');
        ok = false;
    }

    return ok;
}

fcts_check['author-firstname'] = function($input) {
    $author_firstname = $input;
    article_inputs.author_firstname_txt = $author_firstname.val();
    return CheckAuthorFirstname($input, 'author-firstname');
}

fcts_check['article-title'] = function($input) {
    var ok = true;
    $article_title = $input;
    article_inputs.article_title_txt = $article_title.val();
    if ($input.val() == '') {
        PutError('article-title', "Le titre de l'article n'a pas été renseigné !");
        ok = false;
    }

    return ok;
}

fcts_check['article-content'] = function($input) {
    var ok = true;
    $article_content = $input;
    article_inputs.article_content_txt = $article_content.val().replace(/\n/g,"<br>");
    if ($input.val() == '') {
        PutError('article-content', "Le contenu de l'article n'a pas été renseigné !");
        ok = false;
    }

    return ok;
}

function CheckFormAddArticle() {
    var ok = true;
    CleanError('add-article');
    var $inputs = $('#add-article input, #add-article textarea').not(':submit');;
    $inputs.each(function () {
        ok = fcts_check[$(this).attr('id')]($(this)) && ok;
    });

    return ok;
}

$form_add_article.submit(function(event) {
    event.preventDefault();
    if (!CheckFormAddArticle()) {
        return;
    }
    
    AddArticle();

    var str_article = JSON.stringify(article_inputs);
    localStorage.setItem("article" + localStorage.nbArticles, str_article);
    localStorage.nbArticles++;

    MsgInfoAddArticle(true, article_inputs.article_title_txt);

    // $author_name.val('');
    // $author_firstname.val('');
    $article_title.val('');
    $article_content.val('');
});

//---------------------------------Manage-profil

fcts_check_profil['p-author-name'] = function($input) {
    $p_author_name = $input;
    profil_inputs.author_name_txt = $p_author_name.val();
    return CheckAuthorName($input, 'p-author-name');
}

fcts_check_profil['p-author-firstname'] = function($input) {
    $p_author_firstname = $input;
    profil_inputs.author_firstname_txt = $p_author_firstname.val();
    return CheckAuthorFirstname($input, 'p-author-firstname');
}

fcts_check_profil['p-author-address'] = function($input) {
    var ok = true;
    $p_author_address = $input; 
    profil_inputs.author_address_txt = $p_author_address.val(); //.replace(/\n/g,"<br>");
    if ($input.val() == '') {
        PutError('p-author-address', "L'adresse n'a pas été renseignée !");
        ok = false;
    }

    return ok;
}

fcts_check_profil['p-author-birthdate'] = function($input) {
    var ok = true;
    $p_author_birthdate =  $input;
    profil_inputs.author_birthdate_txt = $p_author_birthdate.val();
    var d = new Date().toLocaleDateString('fr-ca');
    // var d = new Date().toISOString().split('T')[0];
    if ($input.val() > d) {
        PutError('p-author-birthdate', "La date de naissance ne doit pas être postérieure à la date courante !");
        ok = false;
    } else {
        var currentYear = d.split('-')[0];
        var birthdateYear = $input.val().split('-')[0];
        var diff = currentYear - birthdateYear;
        if (( diff < 5) || (diff > 120)) {
            PutError('p-author-birthdate', "L'âge doit être compris entre 5 et 120 ans !");
            ok = false;
        }
    }
    
    return ok;
}

fcts_check_profil['p-author-tel'] = function($input) {
    var ok = true;
    $p_author_tel = $input;
    profil_inputs.author_tel_txt = $p_author_tel.val();
    if (!/^0[1-6][0-9]{8}$/.test($input.val())) {
        PutError('p-author-tel', "Le numéro de téléphone est incorrect !");
        ok = false; 
    }

    return ok;
}

fcts_check_profil['p-author-mail'] = function($input) {
    var ok = true;
    $p_author_mail = $input;
    profil_inputs.author_mail_txt = $p_author_mail.val();
    if (!/^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/.test($input.val())) {
        PutError('p-author-mail', "L'email est incorrect !");
        ok = false;     
    }

    return ok; 
}

function CheckFormManageProfil() {
    var ok = true;
    CleanError('manage-profil');
    var $inputs = $('#manage-profil input, #manage-profil textarea').not(':submit');
    
    $inputs.each(function () {
        ok = fcts_check_profil[$(this).attr('id')]($(this)) && ok;
    });

    return ok;
}

$form_manage_profil.submit(function(event) {
    event.preventDefault();
    if (!CheckFormManageProfil()) {
        return;  
    }

    MsgInfoProfil(true);

    var str_profil = JSON.stringify(profil_inputs);
    localStorage.setItem("user_profil", str_profil);

    $p_author_name.val('');
    $p_author_firstname.val('');
    $p_author_address.val('');
    $p_author_birthdate.val('');  
    $p_author_tel.val('');
    $p_author_mail.val('');  
});