Meteor.methods({
    removeAllNewData: function() {
        return NewData.remove({});
    },
    removeAllLastDataLink: function() {
        return LastDataLink.remove({});
    },
    removeAllLastDataNode: function() {
        return LastDataNode.remove({});
    },
    removeAllAlphabet: function() {
        return Alphabet.remove({});
    },
    removeAllNewDataLink: function() {
        return NewDataLink.remove({});
    },
    removeAllNewNode: function() {
        return NewNode.remove({});
    },
    removeAllNewDataNode: function() {
        return NewDataNode.remove({});
    },
    removeAllNewDataLinkTest: function() {
        return tabTestLink.remove({});
    },
    removeAllNewDataNodeTest: function() {
        return tabTestNode.remove({});
    },
    removeAllGlobal: function() {
        return GLOBALE.remove({});
    },

    findElements: function(data){ 
        let finder = LastDataLink.find({from: data}).fetch();
        
        console.log(finder);
        
    }
});

