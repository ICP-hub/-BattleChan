import Error "mo:base/Error";
import Types "types";
module {
    public let successMessage = {
        insert = "Sucessfully Inserted Data!";
        update = "Sucessfully updated Data!";
        delete = "Sucessfully deleted Data";
    };
    public let reject = {
        anonymous = "No Access! Anonymous User.";
        outBound = "Text OverFlow!";
        alreadyExist = "Account already Exist!";
        noAccount = "No Access ! No account Exist.";
        invalidBoard = "BoardName doesn't Exist! ";
        noPost = "No Post Exist!";
        noComment = "No Comment found !";
        noReply = "No Reply found !";
    };
    public let notFound = {
        noUser = "No User Exist!";
        noPost = "No Post Exist!";
        noComment = "No comment Exist!";
        noReply = "No Reply Exist!";
        noData = "No Data Exist !";
    };
};
