//$(".todo-desc")
//add todo or cancel button
var todo = {
    id:0, title:'',
    description:'',
    point:0,
    is_done:false,
    created_at:Date()
}
var done_todos = [];
var todos_list = [];
refereshTodos();
checkIfNight();
$('#add_btn').click(showForm);
//
// add todo
$('#submit_todo').click(addTodo);
////////////

//search todos
$('#search_todos').click(searchTodos);
/////////////

/////night mode
$('#night_mode').click(toggleNightMode);
///////////////

function randId(){
    return Math.ceil(Math.random() *1000);
}
function refereshTodos(){
    todos_list = JSON.parse(localStorage.getItem('todos_list'));
    if(todos_list!=null){
        for(i=0;i<todos_list.length;i++){
            if (!todos_list[i].is_done){
                var todo_element = createTodoElement(todos_list[i]);
                $("#todos_list").append(todo_element);
            }
            else{
                var todo_element = createTodoElement(todos_list[i]);
                $(".done-list").append(todo_element);



            }
            
            //view description////////////
            $(todo_element).click(function(){
                $(this).children('.todo-desc').toggleClass('hide');
            })
            //////////////////////////////


            ///delete todo////////////////
            var del_btn = '#del'+todos_list[i].id;
            $(del_btn).click(function(){
                var li_id = this.id;
                deleteTodo(li_id);
            });
            //////////////////////////////
            

            //done or not done///////////////
            var check_select ="#check"+todos_list[i].id;
            $(check_select).change(function(){
                todos_list = JSON.parse(localStorage.getItem('todos_list'));
                var changed_id = this.id;
                changed_id = changed_id.replace('check','');
                //get index
                var id_index = 0;
                for(i=0;i<todos_list.length;i++){
                    if(todos_list[i].id==changed_id){
                        id_index= i;
                    }
                }
                /////////
                console.log(id_index);
                if(!todos_list[id_index].is_done){
                    todos_list[id_index].is_done = true;
                }
                else{
                todos_list[id_index].is_done = false;
                }
                localStorage.setItem('todos_list',JSON.stringify(todos_list));
                location.reload();
            })
            ///////////////////////////////////
            var edit_btn = '#edit'+todos_list[i].id;
            $(edit_btn).click(function(){
                var edit_todo_id = this.id;
                edit_todo_id = edit_todo_id.replace('edit','');
                var id_index = 0;
                for(i=0;i<todos_list.length;i++){
                    if(todos_list[i].id==edit_todo_id){
                        id_index= i;
                    }
                }
                console.log(id_index);
                updateTodo(id_index);
                

            });
        }
        
    }


}
function createTodoElement(todo_ele){
    if (todo_ele.is_done){
        return $("<li id = \""+todo_ele.id+"\" class=\"todo done\"><div class=\"todo-top\"><div class=\"todo-name\"><p id=\"point\">"+todo_ele.point+"</p><p>"+todo_ele.title+"</p><i id=\"edit"+todo_ele.id+"\" class=\"fa-solid fa-pencil\"></i></div><div><input type=\"checkbox\" class=\"done-btn\" id=\"check"+todo_ele.id+"\" checked><i class=\"fa-solid fa-trash-can delete\" id=\"del"+todo_ele.id+"\"></i></div></div><p class=\"todo-desc hide\">"+todo_ele.description+"</p></li>")
    }
    else{
        return $("<li id = \""+todo_ele.id+"\" class=\"todo\"><div class=\"todo-top\"><div class=\"todo-name\"><p id=\"point\">"+todo_ele.point+"</p><p>"+todo_ele.title+"</p><i id=\"edit"+todo_ele.id+"\" class=\"fa-solid fa-pencil\"></i></div><div><input type=\"checkbox\" class=\"done-btn\" id=\"check"+todo_ele.id+"\"><i class=\"fa-solid fa-trash-can delete\" id=\"del"+todo_ele.id+"\"></i></div></div><p class=\"todo-desc hide\">"+todo_ele.description+"</p></li>")
    }
}

function deleteTodo(li_id){
    li_id = li_id.replace('del','');
    const indexOfObject = findIndexOf(li_id);
      todos_list.splice(indexOfObject,1);
      localStorage.setItem('todos_list',JSON.stringify(todos_list));

      location.reload();
}
function findIndexOf(li_id){
    todos_list = JSON.parse(localStorage.getItem('todos_list'));
    for(i=0;i<todos_list.length;i++){
        if(todos_list[i].id===li_id){
            return i;
        }
    }
}

function showForm(){
    $(".add-todo").toggleClass('hide');
    $("#add_btn").toggleClass('cancel');
    if ($("#add_btn").text() === 'Add Todo'){
        $("#add_btn").text("Cancel");
    }
    else{
        $("#add_btn").text("Add Todo");
    }
}

function updateTodo(todo_index){
    showForm();
    console.log(todo_index);
    todos_list = JSON.parse(localStorage.getItem('todos_list'));

    $('#submit_todo').text('Update');//change what btn say

    $('#title_area'). val(todos_list[todo_index].title);
    $("#desc_area").val(todos_list[todo_index].description); 
    $('#points_slider').val(todos_list[todo_index].point);

    $('#submit_todo').unbind('click');
    $('#submit_todo').click(function(){
        todos_list[todo_index].title = $('#title_area').val();
        todos_list[todo_index].description = $("#desc_area").val();
        todos_list[todo_index].point = $('#points_slider').val();
        todos_list[todo_index].created_at = new Date();
        localStorage.setItem('todos_list',JSON.stringify(todos_list));
        $('#submit_todo').text('Add Todo');
        refereshTodos(todos_list);

    
    })
}
function addTodo(){
    if($('#title_area').val() != ''){        //to prevent empty todos
        var newTodo = todo;
        newTodo.id = randId();
        newTodo.title = $('#title_area').val();
        newTodo.description = $("#desc_area").val();
        newTodo.point = $('#points_slider').val();
        todos_list = JSON.parse(localStorage.getItem('todos_list'));
        
            if(todos_list === null){
                todos_list = [newTodo];
            }
            else{
                todos_list.unshift(newTodo);
    
            }
        localStorage.setItem('todos_list',JSON.stringify(todos_list));
        refereshTodos(todos_list);
        }
        return newTodo.id;
}
function searchTodos(){
    var search_result = [];
    todos_list = JSON.parse(localStorage.getItem('todos_list'));

    var title = $("#title_search").val();
    var desc = $("#desc_search").val();
    if(title != '' && desc ==''){
        for(i=0;i<todos_list.length;i++){
            if((todos_list[i].title).indexOf(title) != -1){
                search_result.unshift(todos_list[i]);
            }
        }
    }
    if(desc != '' && title == ''){
        for(i=0;i<todos_list.length;i++){
            if((todos_list[i].description).indexOf(desc) != -1){
                search_result.unshift(todos_list[i]);
            }
        }
    }

    // localStorage.setItem('temp_list',JSON.stringify(todos_list));
    // localStorage.setItem('todos_list',JSON.stringify(search_result));
    // refereshTodos();
    //the above code not only search but also removes everything else so its not practical

    alert(search_result.length+" todos were found");

}

function toggleNightMode(){
    var night_mode = localStorage.getItem('night_mode');
    if(night_mode == 'true'){
        makeNight();
        localStorage.setItem('night_mode','false');
    }
    else{
        unmakeNight();
        localStorage.setItem('night_mode','true');

    }

}

function makeNight(){
        $('body').addClass('make-body-dark');
        $('.top-container , .todo, .fa-pencil, h1').addClass('make-todo-dark make-text-dark');
        $('label,textarea,.fa-circle-half-stroke').addClass('make-text-dark');
        $('input,textarea').addClass('make-input-dark');

}

function unmakeNight(){
    $('body').removeClass('make-body-dark');
    $('.top-container , .todo, .fa-pencil, h1').removeClass('make-todo-dark make-text-dark');
    $('label,textarea,.fa-circle-half-stroke').removeClass('make-text-dark');
    $('input,textarea').removeClass('make-input-dark');
    }


function checkIfNight(){
    if (localStorage.getItem("night_mode") !== null) {
        var night_mode = localStorage.getItem('night_mode');
        if(night_mode == 'false'){ //check last session state
            makeNight(); //if night mode was on, keep night mode
        }
        else{
            unmakeNight();
        }
      }
      else{ //if session is new and no local storage
          localStorage.setItem("night_mode","true");//make ready for night mode toggle
      }
    
}