 $(document).ready(function () {
         $("#tabs").tabs();
         $('#SKU').on('focus', function(e){
         	$("#Confirmation_Data").html("");
         });
        $('#ESKU').on('focus', function(e){
         	$("#Confirmation_Edit_Data").html("");
         });

         $('#SKU').focusout(function(){
	 			$.ajax({
						    url: "/perl/jadrn026/Check_Duplicate.cgi?sku="+$('#SKU').val(),
							type: "get",
							success: function(response){
								if(response == "OK"){
								}else{
									$('#Error_Message').css("display","block");
									$("#Error_Message").html(response);
									$('#Error_Message').fadeOut(6000);
								}
				   			},
				   			error:function(response){
				   					$('#Error_Message').css("display","block");
									$("#Error_Message").html("Something went worng, Unable to instert in database!");
							        $('#Error_Message').fadeOut(6000);
				   			}
				   	});
	 		});    


     	$('#Add_Form').on( "submit",function(e) {
	 		e.preventDefault();	
	 		if((document.getElementById("image").files[0].size)/ 1000 > 1000){
	 			$('#Error_Message').css("display","block");
				$("#Error_Message").html("Image too big, it should be less than 2MB!");
				$('#Error_Message').fadeOut(6000);
	 			return;
	 		}
	 		var sku_add = $('#SKU').val();
	 		var form_data = new FormData($('form')[0]);
        	var fname = $("#image").val();       
        	var where = fname.lastIndexOf("\\");
        	fname = fname.substring(where+1);    
        	form_data.append("image", document.getElementById("image").files[0]);
	        $.ajax( {
	            url: "/perl/jadrn026/Image_Upload.cgi",
	            type: "post",
	            data: form_data,
	            processData: false,
	            contentType: false,
	            success: function(response) {
	            		var Form_Data = $('#Add_Form').serialize();
					 		$.ajax({
									url: "/perl/jadrn026/Insert_Data.cgi",
									type: "get",
									data: Form_Data,
									success: function(response){
										if(response == "OK"){
											$('#Success_Message').css("display","block");
											$("#Success_Message").html("Item successfully added to Inventory, Add another item!");
											$('#Success_Message').fadeOut(10000);
											$("#Add_Form")[0].reset();
											   Confirm_Data(sku_add);

										}else{
											$('#Error_Message').css("display","block");
											$("#Error_Message").html(response);
											$('#Error_Message').fadeOut(6000);
										}
				   					},
				   					error:function(response){
				   							$('#Error_Message').css("display","block");
											$("#Error_Message").html("Something went worng, Unable to instert in database!");
											$('#Error_Message').fadeOut(6000);
				   					}
				   			});
	                },
	            error: function(response) {
	            	$("#Error_Message").style.display = "block";
	                $("#Error_Message").html("Error occoured while uploading Image");
	                $('#Error_Message').fadeOut(10000);
	            }
	        });	 	
		 });


	 	$('#Edit_Form').on( "submit",function(e) {
	 		e.preventDefault();	

	 		 $.ajax({
				url: "/perl/jadrn026/Retrieve_Data.cgi?sku="+$('#ESKU').val(), 
				type: "get",
				success: function(response){			
				if(response == "Not Found"){
	 							$('#Error_Message1').css("display","block");	
								$("#Error_Message1").html("Couln't find SKU from Inventory!");
								$('#Error_Message1').fadeOut(10000);
				}else{
                		var Data_String = ArrayC(response,'~');
                		$("#Edit_Form").css("display","none");
                		$("#Edit_Form_New").css ("display","block"); 
                		$("#NSKU").val(Data_String[0]);
                		$("#Nvender_name").val(Data_String[2]);       
		                $("#Ncategory").val(Data_String[1]);
		                $("#Nmenu_id").val(Data_String[3]);
		                $("#Nquantity").val(Data_String[8]);
		                $("#Ncost").val(Data_String[6]);
		                $("#Nretail").val(Data_String[7]);
		                $("#Ndescription").val(Data_String[4]);
		                $("#Nfeatures").val(Data_String[5]);
		                $("#Simage").attr("src","http://jadran.sdsu.edu/~jadrn026/proj1/Product_Image/"+Data_String[0]+".jpg");	
				}
	   		}});
		 });

		 $('#Edit_Form_New').on("submit",function(e){
		 		e.preventDefault();
		 		if($("#Nimage").val() === "")
		            Update_Data();
		        else{
		        	if((document.getElementById("Nimage").files[0].size)/ 1000 > 1000){
			 			$('#Error_Message2').css("display","block");
						$("#Error_Message2").html("Image too big, it should be less than 2MB!");
						$('#Error_Message2').fadeOut(6000);
                    }else{
		                Update_Photo();
		        	}
		        }
		 	
		 });

		 $('#Delete_Form').on( "submit",function(e) {
	 		e.preventDefault();	

	 		 $.ajax({
				url: "/perl/jadrn026/Retrieve_Data.cgi?sku="+$('#SKU2').val(), 
				type: "get",
				success: function(response){

				if(response == "Not Found"){

	 							$('#Error_Message3').css("display","block");
								$("#Error_Message3").html("Couln't find SKU from Inventory!");
								$('#Error_Message3').fadeOut(10000);
				}else{
                		var Data_String = ArrayC(response,'>');
                		$("#Delete_Form").css("display","none");
                		$("#Delete_Form_New").css ("display","block");   
                		$("#DSKU").val(Data_String[0]);
                		$("#Dvender_name").val(Data_String[2]);       
		                $("#Dcategory").val(Data_String[1]);
		                $("#Dmenu_id").val(Data_String[3]);
		                $("#Dquantity").val(Data_String[8]);
		                $("#Dcost").val(Data_String[6]);
		                $("#Dretail").val(Data_String[7]);
		                $("#Ddescription").val(Data_String[4]);
		                $("#Dfeatures").val(Data_String[5]);
		                $("#Dimage").attr("src","http://jadran.sdsu.edu/~jadrn026/proj1/Product_Image/"+Data_String[0]+".jpg");
		        }
	   		}});
		 });

		 $('#Delete_Form_New').on("submit",function(e){
		 		e.preventDefault();	
		 	 $.ajax({
				url: "/perl/jadrn026/Delete_Data.cgi?sku="+$('#SKU2').val(),
				type: "get",
				success: function(response){
							if(response == "OK"){
								$('#Delete_Form_New').css("display","none");
								$('#Delete_Form').css("display","block");
								$("#Delete_Form")[0].reset();
								$('#Success_Message_Delete').css("display","block");
								$("#Success_Message_Delete").html("Item successfully Deleted, Delete another one!");
								$('#Success_Message_Delete').fadeOut(10000);
							}else{
								$('#Error_Message4').css("display","block");
								$("#Error_Message4").html(response);
								$('#Error_Message4').fadeOut(10000);
							}
	   					},
	   					error:function(response){
	   							$('#Error_Message4').css("display","block");
								$("#Error_Message4").html("Something went worng, Unable to instert in database!");
								$('#Error_Message4').fadeOut(10000);
	   					}
	   		});
		 });


		 	window.addEventListener( "pageshow", function ( event ) {
      var historyTraversal = event.persisted || ( typeof window.performance != "undefined" && window.performance.navigation.type === 2 );
      if ( historyTraversal ) {
        window.location.href = "http://jadran.sdsu.edu/~jadrn026/proj1/index.html";
      }
    });
	
 });

 function Update_Data(){
 				var Form_Data = "sku="+$('#NSKU').val()+"&"+$('#Edit_Form_New').serialize();
		 	 $.ajax({
				url: "/perl/jadrn026/Edit_Data.cgi", 
				type: "get",
				data: Form_Data,
				success: function(response){
							if(response == "OK"){
								$('#Edit_Form_New').css("display","none");
								$('#Edit_Form').css("display","block");
								Confirm_Data1($('#NSKU').val());
								$("#Edit_Form")[0].reset();
								$('#Success_Message_Edit').css("display","block");
								$('#Success_Message_Edit').html("Item successfully Edited, Edit another one!");
								$('#Success_Message_Edit').fadeOut(10000);
								
							}else{
								$('#Error_Message2').css("display","block");
								$("#Error_Message2").html(response);
								$('#Error_Message2').fadeOut(10000);
							}
	   					},
	   					error:function(response){
	   							$('#Error_Message2').css("display","block");
								$("#Error_Message2").html("Something went worng, Unable to edit in database!");
								$('#Error_Message2').fadeOut(10000);
	   					}
	   		});
 }

 function Update_Photo(){
 			var form_data = new FormData($('form')[2]);
        	var fname = $("#Nimage").val();       
        	var where = fname.lastIndexOf("\\"); 
        	fname = fname.substring(where+1);    
        	form_data.append("image", document.getElementById("Nimage").files[0]);
 			$.ajax( {
	            url: "/perl/jadrn026/Image_Upload.cgi",
	            type: "post",
	            data: form_data,
	            processData: false,
	            contentType: false,
	            success: function(response) {
	            	Update_Data();
	            },
	            error: function(response) {
	            	$("#Error_Message2").style.display = "block";
	                $("#Error_Message2").html("Error occoured while uploading Image");
	                $('#Error_Message2').fadeOut(10000);
	            }
	        });
 }

 function ArrayC(item,delimiter) {
        var tempstrg = new Array(1);
        var temp=0;
        var Array_variable=new String(item);

        while (Array_variable.indexOf(delimiter)>0) {
            tempstrg[temp]=Array_variable.substr(0,Array_variable.indexOf(delimiter));
            Array_variable=Array_variable.substr(Array_variable.indexOf(delimiter)+1,Array_variable.length-Array_variable.indexOf(delimiter)+1);
            temp=temp+1
        }

        tempstrg[temp]=Array_variable;
        return tempstrg;
}
function Confirm_Data(addsku){
        $.ajax({
            url: "/perl/jadrn026/Confirmation.cgi?sku="+addsku, 
            type: "get",
            success: function(response){
            if(response == ""){
            }else{
            	var Data_String = ArrayC(response,'~');

            	var temp = "Added Item Data</br><table border='0'>";
            	temp = temp + "<tr><td>sku</td><td>"+Data_String[0]+"</td></tr>" + "<tr><td>Category</td><td>"+Data_String[1]+"</td></tr>" + "<tr><td>Vendor</td><td>"+Data_String[2]+"</td></tr>";
            	temp = temp + "<tr><td>Manufacturer's Identifier</td><td>"+Data_String[3]+"</td></tr>" + "<tr><td>Description</td><td>"+Data_String[4]+"</td></tr>" + "<tr><td>Feature</td><td>"+Data_String[5]+"</td></tr>";
            	temp = temp + "<tr><td>Cost</td><td>"+Data_String[6]+"</td></tr>" + "<tr><td>Retail</td><td>"+"$"+Data_String[7]+"</td></tr>" + "<tr><td>Quantity</td><td>"+Data_String[8]+"</td></tr>";
            	temp = temp + "<tr><td>Image</td><td>"+Data_String[9]+"</td></tr>" + "<tr><td colspan='2'><img src='http://jadran.sdsu.edu/~jadrn026/proj1/Product_Image/"+Data_String[9]+"' width='200' ></td></tr>" + "</table>";

            	$('#Confirmation_Data').html(temp);
              
            }
        }});
}

function Confirm_Data1(editsku){
        $.ajax({
            url: "/perl/jadrn026/Confirmation.cgi?sku="+editsku, 
            type: "get",
            success: function(response){
            if(response == ""){
            }else{
            	var Data_String = ArrayC(response,'~');
				var temp = "Edited Item Data</br><table border='0'>";
            	temp = temp + "<tr><td>sku</td><td>"+Data_String[0]+"</td></tr>" + "<tr><td>Category</td><td>"+Data_String[1]+"</td></tr>" + "<tr><td>Vendor</td><td>"+Data_String[2]+"</td></tr>";
            	temp = temp + "<tr><td>Manufacturer's Identifier</td><td>"+Data_String[3]+"</td></tr>" + "<tr><td>Description</td><td>"+Data_String[4]+"</td></tr>" + "<tr><td>Feature</td><td>"+Data_String[5]+"</td></tr>";
            	temp = temp + "<tr><td>Cost</td><td>"+Data_String[6]+"</td></tr>" + "<tr><td>Retail</td><td>"+"$"+Data_String[7]+"</td></tr>" + "<tr><td>Quantity</td><td>"+Data_String[8]+"</td></tr>";
            	temp = temp + "<tr><td>Image</td><td>"+Data_String[9]+"</td></tr>" + "<tr><td colspan='2'><img src='http://jadran.sdsu.edu/~jadrn026/proj1/Product_Image/"+Data_String[9]+"' width='200' ></td></tr>" + "</table>";


            	$('#Confirmation_Edit_Data').html(temp);
              
            }
        }});
}