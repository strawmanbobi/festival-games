/**
 * Created by dummy team
 * 2018-01-28
 */

var app = require('../festival-games.js');

var gameService = require('../rest_services/game_service.js');

app.post('/api/game/create_game', gameService.createGame);
app.post('/api/game/visit_game', gameService.visitGame);
