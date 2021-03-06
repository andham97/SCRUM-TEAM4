/**
 * @module Meal planner API
 */
var router = require('express').Router();

/**
 * Get all the recipes current user has planned
 *
 * @name Get all recipes user has planned
 * @route {GET} /api/recipe/me
 *
 */
router.get('/me', function(req, res){
    pool.query('SELECT recipe_name, recipe_id, recipe_directions, recipe_servings, recipe_time, forename, middlename, lastname, meal_datetime ' +
        'FROM recipe LEFT JOIN person_recipe USING (recipe_id) '+
        'LEFT JOIN person ON (recipe.person_id = person.person_id) ' +
        'WHERE person_recipe.person_id = ?',
        [req.session.person_id], function(err, result){
            if(err)
                return res.status(500).send(err);
            var recipes = result;
            pool.query('SELECT recipe_id, ingredient_id, ingredient_amount, ingredient_unit, ingredient_name, ingredient_optional ' +
                'FROM recipe_ingredient ' +
                'LEFT JOIN recipe USING (recipe_id) ' +
                'LEFT JOIN person_recipe USING (recipe_id) ' +
                'WHERE person_recipe.person_id = ?', [req.session.person_id], function(err, result){
                if(err)
                    return res.status(500).send(err);
                for(var i = 0; i < result.length; i++){
                    for(var j = 0; j < recipes.length; j++){
                        if(result[i].recipe_id == recipes[j].recipe_id){
                            if(!recipes[j].person){
                                recipes[j].person = {};
                                recipes[j].person.forename = recipes[j].forename;
                                recipes[j].person.middlename = recipes[j].middlename;
                                recipes[j].person.lastname = recipes[j].lastname;
                                delete recipes[j].forename;
                                delete recipes[j].middlename;
                                delete recipes[j].lastname;
                            }
                            if(!recipes[j].ingredients)
                                recipes[j].ingredients = [];
                            delete result[i].recipe_id;
                            recipes[j].ingredients.push(result[i]);
                        }
                    }
                }
                res.status(200).json(recipes);
            });
        });
});

/**
 * Get all the recipes a group has currently planned
 *
 * @name Get all recipes group has planned
 * @route {GET} /api/recipe/{group_id}
 *
 */
router.get('/:group_id', function(req, res){
    pool.query('SELECT recipe_id, recipe_name, recipe_directions, recipe_servings, recipe_time, forename, middlename, lastname, meal_datetime ' +
        'FROM recipe LEFT JOIN group_recipe USING (recipe_id) '+
        'LEFT JOIN home_group USING (group_id) ' +
        'LEFT JOIN person ON (recipe.person_id = person.person_id) ' +
        'WHERE home_group.group_id = ?',
        [req.params.group_id], function(err, result){
            if(err)
                return res.status(500).send(err);
            var recipes = result;
            pool.query('SELECT recipe_id, ingredient_id, ingredient_amount, ingredient_unit, ingredient_name, ingredient_optional ' +
                'FROM recipe_ingredient ' +
                'LEFT JOIN recipe USING (recipe_id) ' +
                'LEFT JOIN group_recipe USING (recipe_id) ' +
                'WHERE group_id = ?', [req.params.group_id], function(err, result){
                if(err)
                    return res.status(500).send(err);
                for(var i = 0; i < result.length; i++){
                    for(var j = 0; j < recipes.length; j++){
                        if(result[i].recipe_id == recipes[j].recipe_id){
                            if(!recipes[j].person){
                                recipes[j].person = {};
                                recipes[j].person.forename = recipes[j].forename;
                                recipes[j].person.middlename = recipes[j].middlename;
                                recipes[j].person.lastname = recipes[j].lastname;
                                delete recipes[j].forename;
                                delete recipes[j].middlename;
                                delete recipes[j].lastname;
                            }
                            if(!recipes[j].ingredients)
                                recipes[j].ingredients = [];
                            delete result[i].recipe_id;
                            recipes[j].ingredients.push(result[i]);
                        }
                    }
                }
                res.status(200).json(recipes);
            });
        });
});

/**
 * Get all recipes in database
 *
 * @name Get all recipes
 * @route {GET} /api/recipe
 *
 */
router.get('/', function(req, res){
    pool.query('SELECT recipe_name, recipe_id, recipe_directions, recipe_servings, recipe_time, forename, middlename, lastname ' +
        'FROM recipe ' +
        'LEFT JOIN person ON (recipe.person_id = person.person_id)',
        [], function(err, result){
            if(err)
                return res.status(500).send(err);
            var recipes = result;
            pool.query('SELECT recipe_id, ingredient_id, ingredient_amount, ingredient_unit, ingredient_name, ingredient_optional ' +
                'FROM recipe_ingredient ' +
                'LEFT JOIN recipe USING (recipe_id)', [req.params.group_id], function(err, result){
                if(err)
                    return res.status(500).send(err);
                for(var i = 0; i < result.length; i++){
                    for(var j = 0; j < recipes.length; j++){
                        if(result[i].recipe_id == recipes[j].recipe_id){
                            if(!recipes[j].person){
                                recipes[j].person = {};
                                recipes[j].person.forename = recipes[j].forename;
                                recipes[j].person.middlename = recipes[j].middlename;
                                recipes[j].person.lastname = recipes[j].lastname;
                                delete recipes[j].forename;
                                delete recipes[j].middlename;
                                delete recipes[j].lastname;
                            }
                            if(!recipes[j].ingredients)
                                recipes[j].ingredients = [];
                            delete result[i].recipe_id;
                            recipes[j].ingredients.push(result[i]);
                        }
                    }
                }
                res.status(200).json(recipes);
            });
        });
});

/**
 * Register recipe for personal calendar
 *
 * @name Register recipe
 * @route {POST} /api/recipe/me
 * @bodyparam {number} recipe_id the unique id for a recipe
 * @bodyparam {number} meal_datetime the planned time for a meal
 *
 */
router.post('/me', function(req, res){
    if(!req.session.person_id)
        return res.status(500).send();
    if(!req.body.recipe_id || !req.body.meal_datetime)
        return res.status(400).send();
    req.body.meal_datetime = new Date(req.body.meal_datetime);
    req.body.meal_datetime.setHours(1);
    req.body.meal_datetime.setMinutes(0);
    req.body.meal_datetime.setSeconds(0);
    req.body.meal_datetime = req.body.meal_datetime.toISOString().split('T')[0];
    pool.query('INSERT INTO person_recipe (recipe_id, person_id, meal_datetime) VALUES (?, ?, ?)',
        [req.body.recipe_id, req.session.person_id, req.body.meal_datetime], function(err, result){
            if(err)
                return res.status(500).send(err);
            res.status(200).send(result);
        });
});

/**
 * Register recipe for group calendar
 *
 * @name Register recipe for group calendar
 * @route {POST} /api/recipe/{group_id}
 * @bodyparam {number} recipe_id the unique id for a recipe
 * @bodyparam {number} meal_datetime planned time for a meal for a group
 *
 */
router.post('/:group_id', function(req, res){
    if(!req.session.person_id)
        return res.status(500).send();
    if(!req.body.recipe_id || !req.body.meal_datetime)
        return res.status(400).send();
    req.body.meal_datetime = new Date(req.body.meal_datetime);
    req.body.meal_datetime.setHours(1);
    req.body.meal_datetime.setMinutes(0);
    req.body.meal_datetime.setSeconds(0);
    req.body.meal_datetime = req.body.meal_datetime.toISOString().split('T')[0];
    pool.query('INSERT INTO group_recipe (recipe_id, group_id, meal_datetime) VALUES (?, ?, ?)',
        [req.body.recipe_id, req.params.group_id, req.body.meal_datetime], function(err, result){
            if(err)
                return res.status(500).send(err);
            res.status(200).send(result);
        });
});

/**
 * Add new recipe to the database
 *
 * @name Add recipe
 * @route {POST} /api/recipe
 * @bodyparam {string} recipe_name the name of the recipe
 * @bodyparam {string} recipe_directions directions for how to make the recipe
 * @bodyparam {number} recipe_time how long time it takes to make a recipe
 * @bodyparam {array} ingredients an array of ingredient_amount, ingredient_unit and ingredient_name
 * @bodyparam {number} recipe_servings number of servings a recipe is made for
 *
 */
router.post('/', function(req, res){
    req.body.ingredients = JSON.parse(req.body.ingredients);
    req.body.ingredients.splice(0,1);
    if(!req.session.person_id)
        return res.status(500).send();
    if(!req.body.recipe_name || !req.body.recipe_directions || !req.body.recipe_servings || !req.body.ingredients || !(req.body.ingredients instanceof Array) || req.body.ingredients.length == 0)
        return res.status(400).send(req.body);
    pool.query('INSERT INTO recipe (recipe_name, recipe_directions, recipe_servings, recipe_time, person_id) VALUES (?, ?, ?, ?, ?)',
        [req.body.recipe_name, req.body.recipe_directions, req.body.recipe_servings, (req.body.recipe_time ? req.body.recipe_time : 0), req.session.person_id],
        function(err, result){
            if(err)
                return res.status(500).send(err);
            var ingredients = req.body.ingredients;
            var qry = 'INSERT INTO recipe_ingredient (ingredient_amount, ingredient_unit, ingredient_name, ingredient_optional, recipe_id) VALUES (?, ?, ?, ?, ?)';
            var vals = [ingredients[0].ingredient_amount, ingredients[0].ingredient_unit, ingredients[0].ingredient_name, (ingredients[0].ingredient_optional ? ingredients[0].ingredient_optional : false), result.insertId];
            for(var i = 1; i < ingredients.length; i++){
                qry += ", (?, ?, ?, ?, ?)";
                vals.push(ingredients[i].ingredient_amount, ingredients[i].ingredient_unit, ingredients[i].ingredient_name, (ingredients[i].ingredient_optional ? ingredients[i].ingredient_optional : false), result.insertId);
            }
            pool.query(qry, vals, function(err, result){
                if(err)
                    return res.status(500).send(err);
                res.status(200).send();
            });
        });
});

/**
 * Move recipe to date
 *
 * @name Move recipe to date
 * @route {PUT} /api/recipe/{group_id}/date
 * @bodyparam {number} todo_id the todo id
 * @bodyparam {number} originalDate the original date for the planned meal
 * @bodyparam {number} newDate the new date for the planned meal
 *
 */
router.put('/:group_id/date', function(req, res){
    pool.query('UPDATE group_recipe SET meal_datetime = ? WHERE recipe_id = ? AND group_id = ? AND meal_datetime = ?',
        [req.body.newDate, req.body.recipe_id, req.params.group_id, req.body.originalDate], function(err, result){
            if(err)
                return res.status(500).send();

        });
});

/**
 * Delete recipe at date, group id and recipe id
 *
 * @name Delete recipe
 * @route {DELETE} /api/recipe/{group_id}/date
 * @bodyparam {number} todo_id the todo id
 * @bodyparam {number} the original date for a planned meal
 *
 */
router.delete('/:group_id/date', function(req, res){
    pool.query('DELETE group_recipe WHERE recipe_id = ? AND group_id = ? AND meal_datetime = ?',
        [req.body.newDate, req.body.recipe_id, req.params.group_id, req.body.originalDate], function(err, result){
            if(err)
                return res.status(500).send();
        });
});

module.exports = router;