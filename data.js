var express = require('express')
var app = express()
var fs = require('fs')
var bodyParser = require('body-parser');
var cors = require('cors')
app.use(bodyParser.json());
app.use(cors({origin: 'null'}));

function question_bank() {
        this.topic = ''
        this.questions = []
}

function load_question_bank(path) {
        var question_bank_file = fs.readFileSync(path)
        return JSON.parse(question_bank_file)
}


function save_question(question) {
        var path = './topics/' + question.topic + '.txt'

        var qbank = new question_bank()

        if(fs.existsSync(path)) qbank = load_question_bank(path)

        qbank.questions.push(question.question)

        fs.writeFile(path, JSON.stringify(qbank), function(err) {
            if (err) console.log(err)
            console.log('question saved.');
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
        var files = fs.readdirSync('./topics')
	var file_names = []
	for(i in files) {
		file_names.push(files[i].replace('.txt', ''))
	}	

        res.send(file_names)
})

app.get('/questions/:topic', function(req, res) {
	var path = './topics/' + req.params.topic + '.txt'
	if(fs.existsSync(path)) {
		res.send(load_question_bank(path))
	} else {
		res.send('topic does not exist')
	}
})

app.listen(3001)
