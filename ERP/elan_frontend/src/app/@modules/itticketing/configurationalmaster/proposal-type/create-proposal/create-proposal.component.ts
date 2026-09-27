import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-create-proposal',
  templateUrl: './create-proposal.component.html',
  styleUrls: ['./create-proposal.component.scss'],
})
export class CreateProposalComponent implements OnInit {
  form: FormGroup;
  id: string;
  mode: string;

  constructor(
    private fb: FormBuilder,
    private service: ConfigurationalmasterService,
    private location: Location,
    private route: ActivatedRoute,
    private toast: ToastrService
  ) {
    this.form = this.fb.group({
      perposal_type: ['', Validators.required],
      perposal_discription: ['', Validators.required],
      status: ['ACTIVE', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
      this.mode = params['mode'];
      if (this.id) {
        this.getProposalById(this.id);
      }
      if (this.mode === 'view') {
        this.form.disable();
      }
    });
  }

  getProposalById(id: string) {
    this.service.getProposalTypeById(id).subscribe((response: any) => {
      if (response && response.data) {
        this.form.patchValue({
          perposal_type: response.data.perposal_type,
          perposal_discription: response.data.perposal_discription,
          status: response.data.status,
        });
      }
    });
  }

  back() {
    this.location.back();
  }

  onSubmit() {
    if (this.mode === 'edit') {
      this.service.updateProposalTypeById(this.id, this.form.value).subscribe(
        (res: any) => {
          console.log(res);
          this.location.back();
          this.toast.success('Proposal Updated successfuly');
        },
        (err: any) => {
          console.log(err);
          this.toast.error(err.error.message);
        }
      );
    } else {
      this.service.createProposalType(this.form.value).subscribe(
        (res: any) => {
          console.log(res);
          this.location.back();
          this.toast.success('Proposal Created successfuly');
        },
        (err: any) => {
          console.log(err);
          this.toast.error(err.error.message);
        }
      );
    }
  }
}
