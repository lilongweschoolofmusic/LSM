document.addEventListener('DOMContentLoaded', function(){
  var form = document.getElementById('teacherForm');
  var grid = document.getElementById('teachersGrid');
  var clearBtn = document.getElementById('clearForm');

  function createCard(imgSrc,name,role,bio){
    var article = document.createElement('article');
    article.className = 'teacher-card';
    article.innerHTML = '<div class="tc-photo"><img src="'+imgSrc+'" alt="'+(name||'Teacher')+'"></div>'+
      '<div class="tc-body"><h3>'+ (name||'Unnamed') +'</h3><p class="tc-role">'+(role||'')+'</p><p class="tc-bio">'+(bio||'')+'</p></div>';
    grid.appendChild(article);
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var file = document.getElementById('teacherPhoto').files[0];
    var name = document.getElementById('teacherName').value.trim();
    var role = document.getElementById('teacherRole').value.trim();
    var bio = document.getElementById('teacherBio').value.trim();
    if (!file) return alert('Please select a photo');
    var reader = new FileReader();
    reader.onload = function(ev){
      createCard(ev.target.result, name, role, bio);
      form.reset();
    };
    reader.readAsDataURL(file);
  });

  clearBtn.addEventListener('click', function(){ form.reset(); });
});
