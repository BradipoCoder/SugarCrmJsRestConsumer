define(['underscore', 'bluebird', 'SugarCrmJsRestConsumer'],
    function(_, Promise, SugarCrmJsRestConsumer)
    {
        var sugar
            , crm_url = 'http://gsi.crm.mekit.it'
            , crm_rest_version = 'v4_1'
            , username = 'user1'
            , password = 'user1'
            ;

        beforeAll(function()
        {
            sugar = new SugarCrmJsRestConsumer(crm_url, crm_rest_version);
        });

        beforeEach(function(done)
        {
            sugar.login(username, password)
                .then(function()
                {
                    done();
                })
                .catch(function(err)
                {
                    done.fail(err);
                })
            ;
        });

        describe("Application", function()
        {

            it("should provide list of fields for modules", function(done)
            {
                var modulesToTest = ["Users", "Groups", "EmailMan", "Reminders", "Employees"];
                var tests = [];
                _.each(modulesToTest, function(moduleName)
                {
                    var p = sugar.getModuleFields(moduleName)
                        .then(function(fields){
                            var checkResult = true;
                            checkResult = checkResult && _.isObject(fields);
                            checkResult = checkResult && _.isString(fields["module_name"]);
                            checkResult = checkResult && _.isString(fields["table_name"]);
                            checkResult = checkResult && _.isObject(fields["module_fields"]);
                            return checkResult;

                        });
                    tests.push(p);
                });

                Promise.all(tests).then(function(checkResults)
                {
                    var collectiveResult = _.every(checkResults, function(v)
                    {
                        return v;
                    });

                    if(!collectiveResult)
                    {
                        throw new Error("Some checks failed!");
                    }

                    done();
                }).catch(function(err)
                {
                    done.fail(err);
                });
            });


            it("should provide list of available modules", function(done)
            {
                sugar.getAvailableModules()
                    .then(function(modules)
                    {
                        //console.log(modules);
                        expect(_.isObject(modules)).toBeTruthy();
                        expect(_.isArray(_.keys(modules))).toBeTruthy();
                        expect(_.isArray(_.values(modules))).toBeTruthy();

                        _.each(modules, function(module, moduleName)
                        {
                            // Module
                            expect(_.isString(module["module_key"])).toBeTruthy();
                            expect(_.isString(module["module_label"])).toBeTruthy();
                            expect(_.isBoolean(module["favorite_enabled"])).toBeTruthy();
                            expect(_.isObject(module["acls"])).toBeTruthy();

                            // Acl
                            expect(_.contains(_.keys(module["acls"]), "edit")).toBeTruthy();
                            expect(_.contains(_.keys(module["acls"]), "delete")).toBeTruthy();
                            expect(_.contains(_.keys(module["acls"]), "list")).toBeTruthy();
                            expect(_.contains(_.keys(module["acls"]), "view")).toBeTruthy();
                            expect(_.contains(_.keys(module["acls"]), "import")).toBeTruthy();
                            expect(_.contains(_.keys(module["acls"]), "export")).toBeTruthy();
                        });

                        done();
                    })
                    .catch(function(err)
                    {
                        done.fail(err);
                    })
                ;
            });

            it("should provide server info", function(done)
            {
                sugar.getServerInfo()
                    .then(function(response)
                    {
                        expect(_.isString(response["flavor"])).toBeTruthy();
                        expect(_.isString(response["version"])).toBeTruthy();
                        expect(_.isString(response["gmt_time"])).toBeTruthy();
                        done();
                    })
                    .catch(function(err)
                    {
                        done.fail(err);
                    })
                ;
            });

        });
    }
);