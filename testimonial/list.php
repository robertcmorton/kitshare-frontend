<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <h1>
        Testimonial List
        <small><?php echo $total_rows;?> Testimonial(s)</small>
      </h1>
      <ol class="breadcrumb">
        <li><a href="<?php echo base_url();?>home"><i class="fa fa-dashboard"></i> Dashboard</a></li>
        <li class="active">Testimonial</li>
      </ol>
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="row">
       
        <!-- /.col -->
        <div class="col-md-12">
		<?php if($this->session->flashdata('success')!=''){ ?>
		<?php echo $this->session->flashdata('success');?>
		<?php } ?>
          <div class="box box-primary">
            <div class="box-header with-border">
             <!-- <h3 class="box-title">Search by:</h3>-->

              <div class="panel-body">
                <div class="has-feedback">
			<!--<form class="form-inline" data-toggle="validator" role="form" method="get" action="<?php echo base_url();?>testimonial">
			 <div class="form-group col-md-4">
       <input type="text" class="form-control" name="content_title" placeholder="Page Title" value="<?php echo $page_title; ?>">
				  </div>
				   <div class="form-group has-success has-feedback col-md-4">
				  <button type="submit" class="btn btn-success"> <i class="fa fa-search"></i> Search </button>
				  </div>
				  </form>-->
				   <?php if($this->session->userdata('PADD')=='Y'){   ?>
				  <div class="form-group col-md-4">
				<a href="<?php echo base_url();?>testimonial/add" class="btn btn-primary">Add Testimonial  <i class="fa fa-plus" aria-hidden="true"></i></a>
				 </div> <?php } ?>
                </div>
              </div>
              <!-- /.box-tools -->
            </div>
            <!-- /.box-header -->
			<form name="bulk_action_form" action="<?php echo base_url();?>testimonial/select_delete" method="post" onSubmit="return delete_confirm();"/>
            <div class="box-body no-padding">
              <div class="mailbox-controls">
                <!-- Check all button -->
							<?php if($this->session->userdata('PDEL')=='Y'){   ?>

               			<input type="submit" class="btn btn-danger" name="bulk_delete_submit" value="Delete"/>
      <?php } ?>
                                <div class="pull-right">
                <?php echo $paginator;?>
                  <!-- /.btn-group -->
                </div>
                <!-- /.pull-right -->
              </div>
              <div class="table-responsive mailbox-messages">
                <table class="table table-hover table-striped">
				  <thead>
                  <tr>
				  	<th><input type="checkbox" name="select_all" id="select_all"  /></th>
					<th>SI No.</th>
					<th>Testimonial</th>
					<th>Status</th>
					<th>Created Date</th>
                    <th class="taC">Action</th>
                  </tr>
                </thead>
                  <tbody>
				  <?php if($testimonial->num_rows()>0){$i=1;
				  foreach($testimonial->result() as $row){ ?>
                  <tr>
                    <td><input type="checkbox" name="checked_id[]" class="checkbox" id="checked_id" value="<?php echo $row->testimonial_id;?>"></td>
                    <td class="mailbox-name"><?php echo $i;?></td>
					<td class="mailbox-subject"><?php echo $row->testimonials_desc;?></td>
					<td class="mailbox-subject"><?php if($row->status=='Y'){ echo 'Active';}else { echo 'Inactive';}?></td>
				<td class="mailbox-subject"><?php echo date('d M, Y', strtotime($row->created_date)); ?></td>
					<td class="mailbox-date">
									   <?php if($this->session->userdata('PEDIT')=='Y'){   ?>
					<a href="<?php echo base_url();?>testimonial/edit/<?php echo $row->testimonial_id; ?>" title="Modify"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a> <?php } ?>
							<?php if($this->session->userdata('PDEL')=='Y'){   ?>
					<a onClick="return confirm('Would you like to delete this testimonial?');" href="<?php echo base_url();?>testimonial/delete_record/<?php echo $row->testimonial_id; ?>" title="Delete"><i class="fa fa-trash-o"></i></a> <?php } ?></td>
                  </tr>
				  <?php $i++; } ?>
				  <?php } else {?>
				  <tr><td colspan="10" align="center">No record found</td> </tr>
				  <?php  }?>
                  </tbody>
                </table>
                <!-- /.table -->
              </div>
              <!-- /.mail-box-messages -->
            </div>
			</form>

            <!-- /.box-body -->
            <div class="box-footer no-padding">
              <div class="mailbox-controls">

                <!-- Check all button -->
                
                <!-- /.btn-group -->
                <div class="pull-right">
                <?php echo $paginator;?>
                  </div>
                  <!-- /.btn-group -->
                </div>
                <!-- /.pull-right -->
              </div>
            </div>
          </div>
          <!-- /. box -->
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->
    </section>
    <!-- /.content -->
  </div>
  
  <script type="text/javascript" src="<?php echo base_url();?>dist/js/jquery.min.js"></script>
<script type="text/javascript">
function delete_confirm(){
	var result = confirm("Are you sure to delete?");
	if(result){
		return true;
	}else{
		return false;
	}
}

$(document).ready(function(){
    $('#select_all').on('click',function(){
        if(this.checked){
            $('.checkbox').each(function(){
                this.checked = true;
            });
        }else{
             $('.checkbox').each(function(){
                this.checked = false;
            });
        }
    });
	
	$('.checkbox').on('click',function(){
		if($('.checkbox:checked').length == $('.checkbox').length){
			$('#select_all').prop('checked',true);
		}else{
			$('#select_all').prop('checked',false);
		}
	});
});
</script>