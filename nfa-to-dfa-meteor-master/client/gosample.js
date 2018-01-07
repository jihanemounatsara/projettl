//Meteor.subscribe('lastdata');
Template.test.helpers({
	testss: function(){
		return LastDataNode.find({});
	},
	test2: function(){
		return LastDataLink.find({});
	},
	test3: function(){
		return Alphabet.find({});
	},
	test4: function(){
		return NewNode.find({});
	},
	test5: function(){
		return NewDataNode.find({});
	},
	test6: function(){
		return NewDataLink.find({});
	},
	test7: function(a,b){
		if(a%b==0){
			return true;
		}
		else 
			return false;
	     }

});
Template.bouton.events({
	'click .supprimer': function(event){
		Meteor.call('removeAllLastDataLink');
        Meteor.call('removeAllLastDataNode');
        Meteor.call('removeAllAlphabet');
        Meteor.call('removeAllNewDataLink');
        Meteor.call('removeAllNewDataNode');
        Meteor.call('removeAllNewNode');
        Meteor.call('removeAllNewDataLinkTest');
        Meteor.call('removeAllNewDataNodeTest');
        Meteor.call('removeAllGlobal');

        
	},
	'click .btn': function(event){
//////////////////////////////////////////////////
//*********** si la page est actualiser 
			
//les fonction
		function cherche(data,alpha,etat) {
	        var resulTab = "";
	        var l=0;
	        var vec=[];
	        var etat = etat.toString();
	        //console.log(etat);
	        var chaineEtat = etat.split(",");
	        for (var i = 0; i < data.length; i++) {
	        	for (var j = 0; j < chaineEtat.length; j++) {
	        		if ((data[i].text == alpha) && data[i].from == chaineEtat[j]) {
		        		if (resulTab.length==0) {
		        			resulTab=data[i].to;
		        			vec[l]=data[i].to;
		        			l++;
		        		}else{
		        			if (vec.includes(data[i].to)==false){
		        				resulTab+=","+data[i].to;
		        			    vec[l]=data[i].to;
		        			    l++;
		        			}
		        		    

		        	    }
		        	}
		        	/////////////////traiter les epsilone
		        	if ((data[i].text == "e") && data[i].from == chaineEtat[j]) {
		        		if (resulTab.length==0) {
		        			resulTab=data[i].to;
		        			chaineEtat.push(data[i].to);
		        			vec[l]=data[i].to;
		        			l++;
		        		}else
		        		   {
			        			if (vec.includes(data[i].to)==false)
			        			 {
			        				resulTab+=","+data[i].to;
			        				chaineEtat.push(data[i].to);
			        			    vec[l]=data[i].to;
			        			    l++;
			        			  }
		        	        }  
		        	}
	        	}
		        	
	        }
	        if (resulTab.length ==0) {
	        	resulTab="@";
	        }
	        return resulTab;
	    }
	    function serch(tab,ch){
			if(ch=="@"){
						return ch;
			}
			else {
				for (var i = 0; i < tab.length; i++) {
				if (tab[i].key==ch) {
					return tab[i].text;
				}	
			}}
		}
	    //////////////////////////////////////////////////////////

		
		event.preventDefault();
        Meteor.call('removeAllLastDataLink');
        Meteor.call('removeAllLastDataNode');
        Meteor.call('removeAllAlphabet');
        Meteor.call('removeAllNewDataLink');
        Meteor.call('removeAllNewDataNode');
        Meteor.call('removeAllNewNode');
        
		document.getElementById("mySavedModel").value = myDiagram.model.toJson();
		dataaaa = myDiagram.model.toJson();
		objLast = JSON.parse(dataaaa);


		for (var i = 0; i < objLast.linkDataArray.length; i++) {
			LastDataLink.insert(objLast.linkDataArray[i]);
			
		}
		for (var i = 0; i < objLast.nodeDataArray.length; i++) {
			LastDataNode.insert(objLast.nodeDataArray[i]);
			
		}

		var Link = LastDataLink.find({}).fetch();
		var node = LastDataNode.find({}).fetch();

		//etat initial
		var initial="";
		for (var i = 0; i < node.length; i++) {
			var init = node[i].text;
			boolInit =  init.includes("initial");
			if(boolInit == true){
				if (initial.length==0) {
	        			initial=node[i].key;
	        		}else
	        		initial+=","+node[i].key;

			}
		}
		//etat final 
		for (var i = 0; i < node.length; i++) {
			var fin = node[i].text;
			boolFin =  fin.includes("final");
			if(boolFin == true){
				var final=node[i].key;
				break;
			}
		}

		

		var alphabet=[];
		for (var i = 0; i < Link.length; i++) {
			if(alphabet.includes(Link[i].text)==false && Link[i].text!="e" ){
				alphabet.push(Link[i].text);
				Alphabet.insert({name:Link[i].text});
			}
		}

		

		var tablOne = [];
		var tablTwo = [];
		tablOne.push(initial);
		tablTwo.push(initial);
		
		i = 0;
		var granTab =[];
		var ta=[];
		while(tablTwo.length > 0)
		{
			var element = tablTwo.shift();
			for (var j = 0; j < alphabet.length; j++) {
				//function declared
				var funCall =  cherche(Link,alphabet[j],element);
				ta.push(funCall);
				if (!tablOne.includes(funCall)) {
					
						tablOne.push(funCall);
						tablTwo.push(funCall);
				}
			}
			

			granTab.push(ta);
			ta=[];
			i++;
		}
		
		var tabNewSerch = [];
		for (var i = 0; i < tablOne.length; i++) {
			NewNode.insert({name:tablOne[i],key:i});

			tablOne[i] = tablOne[i].toString();
			//console.log(tablOne[i]);
			var chaine = tablOne[i].split(',');
			var returnSrch ="" ;
			for (var j = 0; j < chaine.length; j++) {
				if (returnSrch.length==0) {
		        	returnSrch=serch(node,chaine[j]);
		        }else
		        	returnSrch+=","+serch(node,chaine[j]);
			}
			tabNewSerch.push(returnSrch);
			//NewDataNode.insert({key: i,text:tablOne[i]});
		}


		//new data node tableau des nouveau node !!insertion dan mongo  db
		for (var i = 0; i < tabNewSerch.length; i++) {
			if(i==0){
				tabNewSerch[i]=tabNewSerch[i]+"(initial)";
			}
			if (tabNewSerch[i].includes("initial:") || tabNewSerch[i].includes("final:")) {
				if (tabNewSerch[i].includes("final:")) {
					tabNewSerch[i]=tabNewSerch[i]+"(final)";
				}
				tabNewSerch[i]=tabNewSerch[i].replace(/initial:/gi,"");
				tabNewSerch[i]=tabNewSerch[i].replace(/final:/gi,"");
				    NewDataNode.insert({name:tabNewSerch[i],key:i});
				}
			else{
			 
					 NewDataNode.insert({name:tabNewSerch[i],key:i});
				
		       }
		}

		//tableau de determinisation
		var tabdeterminisation=[];
		for (var i = 0; i < tabNewSerch.length; i++) {
			for (var j = 0; j < alphabet.length; j++) {
				granTab[i][j]=granTab[i][j].toString();
				chaine = granTab[i][j].split(',');
				returnSrch ="" ;
						for (var k = 0; k < chaine.length; k++) {
						if (returnSrch.length==0) {
				        	returnSrch=serch(node,chaine[k]);
				        }else
				        	returnSrch+=","+serch(node,chaine[k]);
					}
					tabdeterminisation.push(returnSrch);

			}
			
			
		}
		//stocker a la base mongodb
		for (var i = 0; i < tabdeterminisation.length; i++) {
			if(tabdeterminisation[i].includes("initial:") || tabdeterminisation[i].includes("final:")){
             tabdeterminisation[i]=tabdeterminisation[i].replace(/initial:/gi,"");
             if (tabdeterminisation[i].includes("final:")) {
              	tabdeterminisation[i]=tabdeterminisation[i]+"(final)";
              }
              tabdeterminisation[i]=tabdeterminisation[i].replace(/final:/gi,"");

			NewDataLink.insert({name:tabdeterminisation[i],key:i,colone:alphabet.length});
		     }
		 
		     		else{
				 NewDataLink.insert({name:tabdeterminisation[i],key:i,colone:alphabet.length});
			}
		     	
		}
		//**************************** le tableau complet ********
				function indice(etat){
					for (var i = 0; i < tabNewSerch.length; i++) {
						if(etat==tabNewSerch[i])
							return i;
					}
				}
				var k=0;
				for (var i = 0; i < tabNewSerch.length; i++) {
					for (var j = 0; j < alphabet.length; j++) {
						to = tabdeterminisation[k];
						k++;
						transition = alphabet[j];
						if (tabNewSerch[i]!="@" && to!="@") {
							t = indice(to);
						tabTestLink.insert({"from": i , "to": t, "text": transition});
					}
					}
						
					
				}
				console.log(tabTestLink);

				


var x=0;
var y=0;
		//...................Affichage 
		for (var i = 0; i < tabNewSerch.length; i++) {
           if(i%2==0){
			x+=120;
			y+=0;
			t = x.toString()+" "+y.toString();
			if (tabNewSerch[i]!="@") {
			tabTestNode.insert({text:tabNewSerch[i],key:i,loc:t});
			}
		       } 
		       else{
		       if (tabNewSerch[i]!="@") {	
		       	x+=0;
			    y+=100;
			t = x.toString()+" "+y.toString();

			tabTestNode.insert({text:tabNewSerch[i],key:i,loc:t});
			}
		       }

		}
		
		console.log(tabTestNode);

		var nnnnnnn= tabTestNode.find().fetch();

		var lllllll= tabTestLink.find().fetch();
		var  glo = GLOBALE.insert({"class": "go.GraphLinksModel","nodeDataArray": nnnnnnn,"linkDataArray": lllllll},function(error,result){});
		//var ggggggg = GLOBALE.findOne().fetch();
		var ggggggg = GLOBALE.find().fetch();
		//console.log(ggggggg[0]);
		//var myJsonString = JSON.stringify(ggggggg[0]);

		document.getElementById("mySavedModel").value = JSON.stringify(ggggggg[0]);
		function load() {
		    myDiagramFinal.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
		 }
		 load();





	}
});


