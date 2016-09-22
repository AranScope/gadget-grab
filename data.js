var express = require('express')
var app = express()
var fs = require('fs')
var bodyParser = require('body-parser');
var cors = require('cors')
app.use(bodyParser.json());
app.use(cors({origin: '*'}));

function question_bank() {
        this.topic = ''
        this.questions = []
}

Array.prototype.contains = function(item) {
	return this.indexOf(item) > -1
}	

function load_question_bank(path) {
        var question_bank_file = fs.readFileSync(path)
        var qbank = JSON.parse(question_bank_file)
	console.log(qbank)
	return qbank
}

function save_question(question) {
        var path = './topics/' + question.topic + '.txt'

        var qbank = new question_bank()

        if(fs.existsSync(path)){
        	qbank = load_question_bank(path)
        } 
	qbank.topic = question.topic
	if(question.questions.length > 0) {
		var index = -1
		for(i in qbank.questions) {
			if(qbank.questions[i].id == question.questions[0].id) {
				index = i
				break
			}
		}

		if(index > -1) {
			qbank.questions[index].children.push(question.questions[0].children[0])
		}
		else {
			qbank.questions.push(question.questions[0])
		}	
	}
        fs.writeFile(path, JSON.stringify(qbank), function(err) {
            if (err) console.log(err)
            console.log('question saved.')
   	 });
}

app.post('/questions', function(req, res) {
        console.log('post request')
        var question = req.body
        console.log(question)
        res.send('question saved')
        save_question(question)
})

app.get('/', function(req, res) {
        res.send('hello world')
})
app.get('/topics', function(req, res) {
        console.log('get request')
        var files = fs.readdirSync('./topics/')
	var file_names = []
	console.log(files)
	
	if(files.length > 0) {
		for(var i = 0; i < files.length;i++) {
			var file_name = files[i];
			console.log(file_name)
			file_names.push(file_name.replace('.txt', ''))
		}
	}
	

        res.send(file_names)
})

app.get('/questions/:topic', function(req, res) {
	console.log('request questions for topic: ' + req.params.topic)
	var path = './topics/' + req.params.topic + '.txt'
	if(fs.existsSync(path)) {
		console.log('loading question bank')
		res.send(load_question_bank(path))
	} else {
		console.log('topic does not exist')
		res.send('topic does not exist')
	}
})

app.listen(8081)
