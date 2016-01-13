myApp.constant("menuTree", {
    home: {
        icon: "fa-home",
        query: {
            sparql: "",
            results: {
                clickable: true,
                menuMatch: "intro"
            }
        },
		intro: {
			icon: "fa-home",
			query: {
				sparql: "select ?x as ?title ?x as ?desc ?x as ?queryValue where {?x ?y ?z} limit 1",
				results: {
					clickable: false,
					menuMatch: ""
				}
			}
		},
        academic: {
            icon: "fa-users",
            query: {
                sparql: "select ?teacher as ?title ?email as ?desc ?email as ?queryValue  where {?x rdf:type cin:academic . ?x cin:name ?teacher . ?x cin:email ?email} group by ?teacher order by ?teacher",
                results: {
                    clickable: true,
                    menuMatch :"profile"
                }
            },
			charts: [
				{
					id: "chartGeneralPublications",
					category: "graph",
					type: "Line",
					sparql: "select count(distinct ?public) as ?y ?issued as ?x ?type as ?cat where { ?public rdf:type ?type . ?public cin:title ?name .?public cin:issued ?issued . FILTER (xsd:integer(?issued) > 1999)} group by ?type ?issued order by ?issued"
				}
			],
            profile: {
                icon: "fa-user",
                query: {
                    sparql: "select ?title ?desc ?email as ?queryValue where { ?x rdf:type cin:academic . ?x cin:name ?nome . ?x cin:email '%%%' . ?x cin:email ?email . ?x ?title ?desc . {?x cin:name ?desc} UNION    {?x cin:office ?desc } UNION {?x cin:phone ?desc} UNION {?x cin:lattes ?desc} UNION {?x cin:homepage ?desc} UNION {?x cin:email ?desc}} group by ?nome",
                    results: {
                        clickable: false,
                        menuMatch: "none"
                    }
                }
            },
            publications: {
                icon: "fa-quote-right",
                query: {
                    sparql: "select ?type as ?title fn:concat(?name, fn:concat('.<i> ', fn:concat(?local, fn:concat('</i> [', fn:concat(?issued, ']'))))) as ?desc ?public as ?queryValue ?type as ?group where {?x cin:email '%%%' . ?public ?idProfessor ?x . ?public rdf:type ?type . ?public cin:title ?name . ?public cin:issued ?issued . MINUS { ?public rdf:type cin:newsitem } . OPTIONAL { ?public cin:local ?local} } group by ?name order by DESC(?issued)",
                    results: {
                        clickable: true,
                        menuMatch: "publication"
                    }
                },
				charts: [
					{
						id: "wordCloudCoAuthors",
						category: "wordCloud",
						sparql: "select ?coName as ?x count(?coauthor) as ?y where { ?prof cin:email '%%%' . ?pub cin:author ?prof . ?pub cin:author ?coauthor . ?coauthor cin:name ?coName . FILTER(?coauthor != ?prof)} group by ?coName "
					},
					{
						id: "chartPublicationsPerAcademic",
						category: "graph",
						type: "Line",
						sparql: "select count(distinct ?public) as ?y ?issued as ?x ?type as ?cat where { ?public rdf:type ?type . ?public cin:title ?name .?public cin:issued ?issued . ?public cin:idProfessor ?id . ?id cin:email '%%%' . FILTER (xsd:integer(?issued) > 1999)} group by ?type ?issued order by ?issued"
					}
				],
                publication: {
                    icon: "fa-file-text-o",
                    query: {
                        sparql: "select distinct str(?prop) as ?title str(?val) as ?desc ?val as ?queryValue where { <%%%> ?prop ?val FILTER isLiteral(?val) . FILTER (?prop != cin:author) }",

                        results: {
                            clickable: false,
                            menuMatch: "none"
                        }

                    }
                },
				cinAuthors: {
						icon: "fa-user",
						query: {
							sparql: "select distinct ?name as ?title  ?email as ?desc ?email as ?queryValue where { <%%%> cin:author ?author . ?author cin:name ?name . ?author cin:email ?email} order by ?name",
							
							results: {
								clickable: true,
								menuMatch: "profile"
							}
						}
					}

            },
            newsPerAcademic: {
                icon: "fa-newspaper-o",
                query: {
                    sparql: "select ?date as ?title ?tit as ?desc ?not as ?queryValue where {?not cin:cite ?doc . ?doc cin:email '%%%' . ?not cin:date ?date . ?not cin:title ?tit} group by ?title order by desc(?title)",
                    results: {
                        clickable: true,
                        menuMatch: "newsItem"
                    }
                },
                newsItem: {
                    icon: "fa-newspaper-o",
                    query: {
                        sparql: "select distinct str(?prop) as ?title str(?val) as ?desc ?val as ?queryValue where { <%%%> ?prop ?val FILTER isLiteral(?val)}",
                        results: {
                            clickable: false,
                            menuMatch: "none"
                        }
                    }
                },
					academicPerNewsItem: {
						icon: "fa-user",
						query: {
							sparql: "select ?teacher as ?title ?email as ?desc ?email as ?queryValue  where {?x rdf:type cin:academic . ?x cin:name ?teacher . ?x cin:email ?email . <%%%> cin:cite ?x } group by ?teacher order by ?teacher",
							results: {
								clickable: true,
								menuMatch: "profile"
							}
						}
					}
            },
            orientations: {
                icon: "fa-users",
                query: {
                    sparql: "select distinct ?aluno as ?title ?t as ?desc ?tese as ?queryValue ?tType as ?group where { ?tese rdf:type ?tType . ?tese cin:title ?t . ?tese cin:student ?aluno . ?tese cin:year ?year . ?tese cin:idProfessor ?prof . ?prof cin:email '%%%' } order by ?year",
                    results: {
                        clickable: true,
                        menuMatch: "thesis"
                    }
                },
                thesis: {
                    icon: "fa-indent",
                    query: {
                        sparql: "select distinct str(?prop) as ?title str(?val) as ?desc ?val as ?queryValue where {{<%%%> ?prop ?val FILTER isLiteral(?val)} UNION {?aluno cin:creator <%%%> . ?aluno cin:name ?val . ?aluno ?prop ?val} UNION {?aluno cin:creator <%%%> . ?aluno cin:email ?val . ?aluno ?prop ?val}}",
                        results: {
                            clickable: false,
                            menuMatch: "none"
                        }
                    }
                }

            },
            expertiseAreasByTeacher:{
              icon: "fa-graduation-cap",
                query: {
                    sparql: "select ?eaname as ?desc ?ea as ?queryValue where {?x cin:email '%%%' . ?x rdf:type cin:academic . ?x cin:hasAreaExpertise ?ea . ?ea cin:name ?eaname} group by ?ea order by ?desc",
                    results: {
                        clickable: true,
                        menuMatch: "academicPerArea"
                    }
                }

            },
            linesOfWork: {
                icon: "fa-heart",
                query: {
                    sparql: "select distinct ?ianame as ?desc ?ia as ?queryValue where {?x cin:email '%%%' . ?x rdf:type cin:academic . ?x cin:hasAreaInterest ?ia . ?ia cin:name ?ianame} group by ?ianame order by ?desc",
                    results: {
                        clickable: false,
                        menuMatch: "none"
                    }
                }
            },
            projectsPerAcademic: {
                icon: "fa-gears",
                query: {
                    sparql: "select distinct ?name as ?desc ?name as ?queryValue where {?x cin:email '%%%' . ?x rdf:type cin:academic . ?y rdf:type cin:cooperationproject . ?y  cin:coordinator ?x . ?y cin:name ?name} order by ?desc",
                    results: {
                        clickable: true,
                        menuMatch: "descProjectsCooperation"
                    }
                }
            },
            /*positions: {
                icon: "fa-suitcase",
                query: {
                    sparql: "",
                    results: {
                        clickable: false,
                        menuMatch: "none"
                    }
                }
            }*/
        },
        expertiseAreas: {
            icon: "fa-suitcase",
            query: {
                sparql: "select ?eaname as ?desc ?ea as ?queryValue where {?x rdf:type cin:academic . ?x cin:hasAreaExpertise ?ea . ?ea cin:name ?eaname} group by ?ea order by ?desc",
                results: {
                    clickable: true,
                    menuMatch: "academicPerArea"
                }
            },
			charts: [
				{
						id: "wordCloudExpertiseAreas",
						category: "wordCloud",
						sparql: "select ?area as ?x count(distinct ?x) as ?y where { ?x rdf:type cin:academic . ?x cin:hasAreaExpertise ?ea . ?ea cin:name ?area } group by ?area order by ?y"
				},
				{
					id: "chartExpertiseAreas",
					category: "graph",
					type: "Pie",
					sparql: "select ?area as ?x count(distinct ?siape) as ?y ?eaType as ?cat where { ?x rdf:type cin:academic . ?ea rdf:type ?eaType. ?x cin:hasAreaExpertise ?ea . ?ea cin:name ?area . ?x cin:siape ?siape } order by ?y"
				}
			],
            academicPerArea: {
                icon: "fa-users",
                query: {
                    sparql: "select distinct ?name as ?title ?email as ?desc ?email as ?queryValue where {?x rdf:type cin:academic . ?x cin:hasAreaExpertise <%%%> . ?x cin:name ?name . ?x cin:email ?email} order by ?name",
                    results: {
                        clickable: true,
                        menuMatch: "profile"
                    }
                }
            }

        },
        course: {
            icon: "fa-graduation-cap",
                query: {
                    sparql: "select ?name as ?desc ?name as ?queryValue  where {?x rdf:type cin:course . ?x cin:name ?name } group by ?name order by ?name",
                    results: {
                        clickable: true,
                        menuMatch: "discipline"
                    }
                },
            discipline: {
                icon: "fa-book",
                    query: {
                        sparql: "select distinct ?discipline as ?desc ?ementa as ?queryValue where {?x rdf:type cin:discipline . ?x cin:name ?discipline . ?x cin:code ?code . ?x cin:ementa ?ementa . ?y rdf:type cin:course . ?x cin:idcourse ?y . ?y cin:name '%%%' } group by ?discipline order by ?discipline",
                        results: {
                            clickable: true,
                            menuMatch: "descDiscipline"
                        }
                    },
                descDiscipline: {
                    icon: "fa-info",
                    query: {
                        sparql: "select distinct ?title ?desc ?code as ?queryValue where { ?x rdf:type cin:discipline . ?x cin:name ?name . ?x cin:code ?code  . ?x cin:ementa '%%%' .  ?x ?title ?desc . { ?x cin:name ?desc } UNION {?x cin:code ?desc} UNION {?x cin:ementa ?desc} UNION {?x cin:workload ?desc} UNION {?x cin:type ?desc} } group by ?name order by ?name ",
                        results: {
                            clickable: false,
                            menuMatch: "none"
                        }
                    }
                }, 
                prerequisite: {
                    icon: "fa-check-circle ",
                    query: {
                        sparql: "select distinct ?name as ?desc ?ementa as ?queryValue where { ?x rdf:type cin:discipline . ?x cin:ementa '%%%' . ?y rdf:type cin:discipline . ?x cin:prerequisito ?y . ?y cin:name ?name . ?y cin:code ?code . ?y cin:ementa ?ementa } group by ?name order by ?name",
                        results: {
                            clickable: true,
                            menuMatch: "descDiscipline"
                        }
                    }
                }                  
            }
        },
		projectsInovation: {
			icon: "fa-lightbulb-o ",
                query: {
                    sparql: "select distinct ?name as ?desc ?name as ?queryValue where {?x rdf:type cin:graduationproject . ?x cin:name ?name} order by ?name",
                    results: {
                        clickable: true,
                        menuMatch: "descProjectsInovation"
                    }
                },
            descProjectsInovation: {
                icon: "fa-info",
                query: {
                    sparql: "select distinct ?title ?desc ?name as ?queryValue where { ?x rdf:type cin:graduationproject . ?x cin:desc ?descricao  . ?x cin:name '%%%' . ?x cin:name ?name .  ?x ?title ?desc .{?x cin:name ?desc} UNION {?x cin:desc ?desc} UNION {?x cin:term ?desc} UNION { ?x cin:link ?desc}} order by ?name",
                    results: {
                        clickable: false,
                        menuMatch: "none"
                    }
                }
            },
            studentProject: {
                   icon: "fa-briefcase ",
                query: {
                    sparql: "select distinct ?name as ?title ?email as ?desc ?email as ?queryValue where { ?y rdf:type cin:student . ?x rdf:type cin:graduationproject . ?x cin:name '%%%' . ?x cin:managerProject ?y . ?y cin:name ?name . ?y cin:email ?email } order by ?name",
                    results: {
                        clickable: false,
                        menuMatch: "none"
                    }  
                }
            }
		},
        projectsCooperation: {
            icon: "fa-gears",
                query: {
                    sparql: "select distinct ?name as ?desc ?name as ?queryValue where {?x rdf:type cin:cooperationproject . ?x cin:name ?name} order by ?name",
                    results: {
                        clickable: true,
                        menuMatch: "descProjectsCooperation"
                    }
                },
            descProjectsCooperation: {
                icon: "fa-info",
                query: {
                    sparql: "select distinct ?title ?desc ?name as ?queryValue where { ?x rdf:type cin:cooperationproject  . ?x cin:name '%%%' . ?x cin:name ?name .  ?x ?title ?desc .{?x cin:name ?desc} UNION {?x cin:beginDate ?desc} UNION { ?x cin:endDate ?desc} } order by ?name",
                    results: {
                        clickable: false,
                        menuMatch: "none"
                    }
                }
            },
                companyProject: {
                   icon: "fa-briefcase ",
                query: {
                    sparql: "select distinct ?name as ?title ?cnpj as ?desc ?cnpj as ?queryValue where { ?y rdf:type cin:company . ?x rdf:type cin:cooperationproject . ?x cin:partner ?y . ?y cin:companyName ?name . ?x cin:name '%%%' . ?y cin:cnpj ?cnpj } order by ?name",
                    results: {
                        clickable: false,
                        menuMatch: "none"
                    }  
                }
            },
            teacherProject: {
                   icon: "fa-users",
                query: {
                    sparql: "select distinct ?name as ?title ?email as ?desc ?email as ?queryValue where { ?x rdf:type cin:academic . ?x cin:name ?nome . ?y rdf:type cin:cooperationproject . ?y cin:coordinator ?x . ?x cin:name ?name . ?y cin:name '%%%'. ?x cin:email ?email} order by ?name",
                    results: {
                        clickable: true,
                        menuMatch: "profile"
                    }  
                }
            } 
        },
		news:{
			icon: "fa-newspaper-o",
			query: {
                    sparql: "select ?date as ?title ?tit as ?desc ?not as ?queryValue where {?not cin:cite ?doc . ?not cin:date ?date . ?not cin:title ?tit} group by ?title order by desc(?date)",
                    results: {
                        clickable: true,
                        menuMatch: "newsItem"
                    }
                }
		},
		indicators:{
			icon: "fa-bar-chart",
			query: {
				sparql: "select ?x as ?title ?x as ?desc ?x as ?queryValue where {?x ?y ?z} limit 1",
				results: {
					clickable: false,
					menuMatch: ""
				}
			},
			charts: [
				{
						id: "wordCloudExpertiseAreas",
						category: "wordCloud",
						sparql: "select ?area as ?x count(distinct ?x) as ?y where { ?x rdf:type cin:academic . ?x cin:hasAreaExpertise ?ea . ?ea cin:name ?area } group by ?area order by ?y"
				},
				{
						id: "chartGeneralPublications",
						category: "graph",
						type: "Line",
						sparql: "select count(distinct ?public) as ?y ?issued as ?x ?type as ?cat where { ?public rdf:type ?type . ?public cin:title ?name .?public cin:issued ?issued . FILTER (xsd:integer(?issued) > 1999)} group by ?type ?issued order by ?issued"
				},
                {
                    id: "chartPublicationTypes",
                    category: "graph",
                    type: "Doughnut",
                    sparql: "select count(distinct ?public) as ?y ?type as ?x where { ?public rdf:type ?type . ?public cin:title ?name . ?public cin:issued ?issued } group by ?type"
                },
				{
					id: "chartExpertiseAreas",
					category: "graph",
					type: "Pie",
					sparql: "select ?area as ?x count(distinct ?siape) as ?y where { ?x rdf:type cin:academic . ?x cin:hasAreaExpertise ?ea . ?ea cin:name ?area . ?x cin:siape ?siape } order by ?y"
				},
                {
                    id: "chartExpertiseAreasPublication",
                    category: "graph",
                    type: "Doughnut",
                    sparql: "select ?area as ?x count(distinct ?public) as ?y where { ?x rdf:type cin:academic . ?x cin:hasAreaExpertise ?ea . ?ea cin:name ?area . ?x cin:siape ?siape . ?public cin:idProfessor ?x } order by ?y"
                },
				{
					id: "chartOrientationTypes",
					category: "graph",
					type: "Doughnut",
					sparql: "select count(distinct ?tese) as ?y ?type as ?x where { ?tese cin:student ?aluno . ?tese rdf:type ?type } group by ?type"
				},
				{
					id: "chartGeneralOrientations",
					category: "graph",
					type: "Line",
					sparql: "select count(distinct ?tese) as ?y ?year as ?x ?type as ?cat where { ?tese cin:student ?aluno . ?tese rdf:type ?type . ?tese cin:year ?year . FILTER (xsd:integer(?year) > 1999)} group by ?year ?type order by ?year"
				},
                {
                    id: "chartDisciplineForCourse",
                    category: "graph",
                    type: "Pie",
                    sparql: "select count(distinct ?discipline) as ?y ?course as ?x where { ?x rdf:type cin:discipline . ?x cin:name ?discipline . ?y rdf:type cin:course . ?y cin:name ?course . ?x cin:idcourse ?y . ?x cin:type 'OBRIGATÓRIA'} group by ?course"
                }
				
			]
		}
    }

});
